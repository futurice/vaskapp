'use strict';

import React, { Component } from 'react';
import { Animated, Easing, Platform, StyleSheet, Dimensions, View, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import ModalBackgroundView from '../common/ModalBackgroundView';
import Text from '../common/MyText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ActionButton from './ActionButton';
import ActionButtonLabel from './ActionButtonLabel';
import { openRegistrationView } from '../../concepts/registration';
import theme from '../../style/theme';
import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';
import { updateCooldowns, getActionTypesForFeed } from '../../concepts/competition';
import AnimateMe from '../AnimateMe'

const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

// in a happy world all this would be calculated on the fly but no
const BUTTON_COUNT = 3;
const DISTANCE = 60;
const BUTTON_WIDTH = 46;
const BIG_BUTTON_WIDTH = 56;
const BUTTON_DELAY = 100;

const OPEN = 'OPEN';
const CLOSED = 'CLOSED';

const BUTTON_POS = [];
for (let i = 0; i < BUTTON_COUNT; i++) {
  BUTTON_POS.push({
    x: -(width/BUTTON_COUNT) * i,
    y: -DISTANCE * 3 - (BUTTON_WIDTH + BIG_BUTTON_WIDTH / 2) + 10
  });
}

const styles = StyleSheet.create({
  mainButton: {
    zIndex: 3,
    elevation: 6,
    shadowColor: theme.primary,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: {
      height: 5,
      width: 0
    },
    backgroundColor: theme.black,
  },
  scrollTopButton: {
    elevation: 6,
    shadowColor: theme.black,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: {
      height: 5,
      width: 0
    },
    backgroundColor: theme.stable,
  },
  scrollTopButtonContent: {
    color: '#888'
  },

  actionButtonsWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    zIndex: 2,

    position: 'absolute',
    width: width - 40,
    right: 20,
    bottom: (height / 2) - 100,
    minHeight: 130,

  },
  buttonEnclosure: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,

    // position: 'absolute',
    // right: 20,
    // bottom: height / 2,
    // left: 0,
    // bottom: IOS ? 37 : 20,
    // right: 20,
    overflow: 'visible',
    width: 100,
    height: 120,
    borderRadius: 0
  },
  actionButton: {
    bottom: null,
    right: null,
    width: 56,
    height: 56,

    backgroundColor: theme.primary,
    shadowColor: theme.primary,
    shadowOpacity: 0,
    shadowRadius: 10,
    shadowOffset: {
      height: 2,
      width: 0
    }

  },
  actionButtonContent: {
    color: theme.white,
  },
  mainButtonContent: {
    backgroundColor: 'transparent',
    color: theme.white,
  },
  cooldown: {
    top: IOS ? 3 : 0
  },
  overlay:{
    right: 43,
    bottom:IOS ? 60 : 43,
    position:'absolute',
    backgroundColor: theme.white,
    opacity: 0.8,
    // backgroundColor:theme.light,
    // opacity:0.9,
    width:10,
    height:10,
    borderRadius:5
  },
  overlay_fixed: {
    width,
    height,
    flex: 1,
    flexGrow: 1,
    position: 'absolute',
    zIndex: 99,
    left: 0,
    top: 0,
    right: 0,
    bottom: IOS ? 0 : 43,
    backgroundColor: IOS ? theme.white : 'rgba(255, 255, 255, .8)',
  }
});

const actions = {};
const getBoundAction = (type, subType, fn) => {
  const actionType = `${type}_${subType}`;
  if (actions[actionType]) {
    return actions[actionType];
  }

  actions[actionType] = fn.bind(null, type, subType);
  return actions[actionType];
};

class ActionButtons extends Component {
  // mixins: [TimerMixin]
  constructor(props) {
    super(props);

    this.state = {
      buttons: BUTTON_POS.map(() => new Animated.Value(0)),
      labels: BUTTON_POS.map(() => new Animated.Value(0)),
      plusButton: new Animated.Value(0),
      actionButtonsOpen: false,
      actionButtonsWidth: new Animated.Value(56),
      overlayOpacity: new Animated.Value(0)
    };
  }

  animateButtonsToState(nextState) {
    const { actionTypes } = this.props;
    const { buttons, labels } = this.state;
    const isOpening = nextState === OPEN;

    // change state directly if OPENING
    if (isOpening) {
      this.setState({ actionButtonsOpen: isOpening });
    }

    Animated.spring(this.state.plusButton, { toValue: isOpening ? 1 : 0 }).start();

    actionTypes.forEach((pos, i) => {

      Animated.sequence([
        Animated.delay(isOpening ? ((i+1) * BUTTON_DELAY) : 0),
        Animated.timing(buttons[i], { toValue: isOpening ? 1 : 0, easing: Easing.elastic(1) })
      ]).start();

      // Animate action button labels, 200ms later than buttons
      Animated.sequence([
        Animated.delay(isOpening ? 200 + ((i + 1) * BUTTON_DELAY) : 0),
        Animated.timing(labels[i], { duration:200, toValue: isOpening ? 1 : 0, easing: Easing.elastic(1)  })
      ]).start(() => {

        // Change actual state after animations when CLOSING
        if (i >= actionTypes.size - 1 && !isOpening) {
          this.setState({ actionButtonsOpen: isOpening });
        }
      });
    });



  }

  @autobind
  onToggleActionButtons() {
    const { actionButtonsOpen } = this.state;
    this.props.updateCooldowns();

    if (this.state.actionButtonsOpen === false) {
      this.updateCooldownInterval = this.setInterval(() => {
        this.props.updateCooldowns();
      }, 1000);
    } else {
      this.clearInterval(this.updateCooldownInterval);
    }

    if (this.props.isRegistrationInfoValid === false) {
      this.props.openRegistrationView();
    } else {

      Animated.timing(this.state.overlayOpacity, {
        duration: actionButtonsOpen ? 40 : 150,
        easing: Easing.ease,
        toValue: this.state.actionButtonsOpen ? 0 : 1
      }).start();
      this.animateButtonsToState(actionButtonsOpen ? CLOSED : OPEN);
    }
  }

  @autobind
  onPressActionButtons(type, subType, fn) {
    // Start the action
    getBoundAction(type, subType, fn)();

    // Close Action buttons
    this.onToggleActionButtons();
  }

  componentDidMount(){
    // Close Action buttons on back press
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.state.actionButtonsOpen) {
        this.onToggleActionButtons()
        return true;
      }
      return false;
    })
  }

  getIconForAction(type, overrideType) {

    if (overrideType === 'library') {
      return 'photo-library';
    }

    const mapping = {
      TEXT: 'textsms',
      IMAGE: 'photo-camera',
      SIMA: 'local-bar',
      CHECK_IN_EVENT: 'location-on',
      default: 'image'
    };
    return mapping[type] || mapping['default'];
  }

  getLabelForAction(type) {
    const mapping = {
      TEXT: 'Write a message_',
      IMAGE: 'Take a photo_',
      SIMA: 'Have a drink_',
      CHECK_IN_EVENT: 'Check in to map_',
      default: 'image'
    };
    return mapping[type] || mapping['default'];
  }

  getCooldownTime(actionType) {
    const now = new Date().getTime();
    const diffInSecs = (this.props.cooldownTimes.get(actionType) - now) / 1000;
    const minutes = Math.floor(diffInSecs / 60);
    const seconds = Math.floor(diffInSecs % 60);

    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  }

  renderActionButtons() {
    const { actionTypes, onPressAction, disabledActionTypes } = this.props;

    return actionTypes.map((actionType, i) => {
      const actionTypeCode = actionType.get('code');
      const actionSubTypeCode = actionType.get('subType');
      const actionTypeValue = actionType.get('value');
      const iconName = this.getIconForAction(actionTypeCode, actionSubTypeCode);
      // const labelName = this.getLabelForAction(actionTypeCode);
      const labelName = actionType.get('name').split(' ')[0];
      const isCoolingDown = disabledActionTypes.find(dat => dat === actionTypeCode);

      const iconOrCooldownTime = isCoolingDown
        ? <Text style={[styles.actionButtonContent, styles.cooldown]}>{this.getCooldownTime(actionTypeCode)}</Text>
        : <Icon name={iconName} size={22} style={styles.actionButtonContent}></Icon>;

      const actionButtonStyles = [
        styles.buttonEnclosure,
        {
          transform: [{ scale: this.state.buttons[i] }],
          opacity: this.state.labels[i],
          // width: this.state.actionButtonsWidth
        }
      ];

      return (
        <Animated.View key={`button-${i}`} style={actionButtonStyles}>
          <ActionButtonLabel
            additionalLabel={actionTypeValue}
            extraStyle={{
              opacity: this.state.labels[i],
              transform: [{
                translateY: this.state.labels[i].interpolate({
                  inputRange: [0, 1],
                  outputRange: [-10, 0]
                })
              }]
            }}
          >
            {labelName}
          </ActionButtonLabel>
          <ActionButton
            onPress={() => this.onPressActionButtons(actionTypeCode, actionSubTypeCode, onPressAction)}
            disabled={isCoolingDown}
            underLayColor={theme.primary}
            extraStyle={styles.actionButton}
          >
            {iconOrCooldownTime}
          </ActionButton>
        </Animated.View>
      );
    });
  }

  renderMenuButton() {
    // Show scroll top button instead of add button when scrolled down
    if (this.props.showScrollTopButton) {
      return (
      <ActionButton
        onPress={this.props.onScrollTop}
        underLayColor={theme.lightgrey}
        extraStyle={styles.scrollTopButton}
      >
        <View >
          <Icon name={'keyboard-arrow-up'} size={26} style={[styles.actionButtonContent, styles.scrollTopButtonContent]}></Icon>
        </View>
      </ActionButton>
      );
    }

    const rotation = this.state.plusButton.interpolate({
      inputRange: [0, 1], outputRange: ['0deg', '135deg']
    });

    return (
      <ActionButton
        onPress={this.onToggleActionButtons}
        extraStyle={styles.mainButton}
        underLayColor={theme.black}
      >
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Icon name={'add'} size={24} style={[styles.actionButtonContent, styles.mainButtonContent]}></Icon>
        </Animated.View>
      </ActionButton>
    );
  }

  render() {
    const { isLoading, actionTypes, style, visibilityAnimation } = this.props;
    const { overlayOpacity, plusButton, actionButtonsOpen } = this.state;

    if (isLoading || !actionTypes || actionTypes.size === 0) {
      return null;
    }

    const actionButtonsTranslate = visibilityAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [-100, 0]
    });

    const actionButtonsWrapVisibility = {
      transform: [{ scale: overlayOpacity }]
    };

    return (
      <Animated.View style={[style, { bottom: actionButtonsTranslate }]}>

        <Animated.View style={[styles.overlay, {
          transform:[{scale: overlayOpacity.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 200]
          })}]
        }]} >
        </Animated.View>

        {/*
          <Animated.View style={[styles.overlay_fixed, { opacity: plusButton }]}>
            <ModalBackgroundView blurType='light' style={{ flex: 1 }} />
          </Animated.View>
        */}

        {actionButtonsOpen &&
          <View style={styles.actionButtonsWrap}>
            {this.renderActionButtons()}
          </View>
        }

        {this.renderMenuButton()}

      </Animated.View>
    );
  }
}

const mapDispatchToProps = { updateCooldowns, openRegistrationView };

const select = store => {
  return {
    actionTypes: getActionTypesForFeed(store),
    disabledActionTypes: store.competition.get('disabledActionTypes'),
    cooldownTimes: store.competition.get('cooldownTimes')
  };
};

reactMixin(ActionButtons.prototype, TimerMixin);
export default connect(select, mapDispatchToProps)(ActionButtons);
