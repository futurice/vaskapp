// Icon and Text Tab bar
// https://www.google.com/design/spec/components/bottom-navigation.html
'use strict';

import React from 'react';
import {
  StyleSheet,
  View,
  Animated,
  Easing
} from 'react-native';

import Text from '../common/MyText';
import ModalBackgroundView from '../common/ModalBackgroundView';
import Icon from 'react-native-vector-icons/MaterialIcons';
import TouchableNativeFeedback from './PlatformTouchable';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { isIpad } from '../../services/device-info';

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 0,
  },
  tabs: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: {
      height: -2,
      width: 0
    },
    height: isIphoneX() ? 62 : 54,
    paddingBottom: isIphoneX() ? 15 : 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: isIpad ? 100 : 0,
    borderWidth: 0,
    borderTopWidth: 0,
    borderTopColor: '#f1f1f1',
  },
  textLabel: {
    fontSize: 10,
    fontWeight: 'normal',
    textAlign:'center',
    fontFamily: 'Futurice',
    position:'absolute',
    marginTop: 2,
    left:0,
    right:0,
    bottom: isIphoneX() ? 4 : 7
  }
});


const defaultIconSize = 22;

const AnimatedIcon = Animated.createAnimatedComponent(Icon);
var MdIconTabBar = React.createClass({
  propTypes: {
    goToPage: React.PropTypes.func,
    activeTab: React.PropTypes.number,
    tabs: React.PropTypes.array,
    backgroundColor : React.PropTypes.string,
    activeTextColor : React.PropTypes.string,
    inactiveTextColor : React.PropTypes.string,
  },

  getInitialState() {
    const { activeTab } = this.props;
    return {
      buttonAnimations: this.props.tabs.map((t, index) =>
        new Animated.Value(index === activeTab ? 1 : 0)
      )
    };
  },

  componentWillReceiveProps(nextProps) {
    const { buttonAnimations } = this.state;
    if (nextProps.activeTab !== this.props.activeTab) {
      buttonAnimations.map((b, index) => {
        b.setValue(0);
      });
      Animated.timing(buttonAnimations[nextProps.activeTab], { duration: 330, easing: Easing.elastic(1), toValue: 1}).start();
    }
  },

  renderTabOption(item, page) {
    const isTabActive = this.props.activeTab === page;
    const activeTextColor = this.props.activeTextColor || 'black';
    const inactiveTextColor = this.props.inactiveTextColor || 'black';
    const buttonAnimation = this.state.buttonAnimations[page];

    return (
    <TouchableNativeFeedback
      key={item.title}
      onPress={() => this.props.goToPage(page)}
      style={{ flex: 1 }}
      activeOpacity={0.9}
    >
      <View style={[styles.tab, { paddingLeft: isTabActive ? 0 : 0, paddingRight: isTabActive ? 0 : 0 }]}>

        <AnimatedIcon
          name={item.icon}
          size={item.iconSize || defaultIconSize}
          style={{
            bottom: buttonAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 7] }),
            color: isTabActive ? activeTextColor : inactiveTextColor,
          }} />

        {item.title && isTabActive &&
          <Animated.Text style={[
            styles.textLabel,
            {
              color: activeTextColor,
              opacity: isTabActive ? buttonAnimation : 1,
              transform: [{
                scale: isTabActive ? buttonAnimation : 0
              }]
            }
          ]}>
          {item.title}
          </Animated.Text>
        }

      </View>
    </TouchableNativeFeedback>
    );
  },

  render() {
    const { tabs, backgroundColor, style } = this.props;

    return (
        <View style={[styles.tabs, { backgroundColor: backgroundColor || null }, style]}>
          {tabs.map((tab, i) => this.renderTabOption(tab, i))}
        </View>
      );
  },
});

module.exports = MdIconTabBar;
