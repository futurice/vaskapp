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
import Icon from 'react-native-vector-icons/MaterialIcons';
import TouchableNativeFeedback from './PlatformTouchable';

const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  tabs: {
    elevation: 5,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 0,
    borderTopWidth: 0,
    borderTopColor: '#f1f1f1'
  },
  textLabel: {
    fontSize: 11,
    fontWeight: '100',
    textAlign:'center',
    position:'absolute',
    marginTop: 2,
    left:0,
    right:0,
    bottom: 7
  }
});


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
    const { activeTab } = this.props;
    if (nextProps.activeTab !== activeTab) {
      buttonAnimations.map(b => {
        b.setValue(0);
      });
      Animated.timing(buttonAnimations[nextProps.activeTab], { duration: 250, easing: Easing.ease, toValue: 1}).start();
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
      background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
      delayPressIn={0}
      style={{ flex: 1 }}
    >
      <Animated.View style={styles.tab}>
        <AnimatedIcon
          name={item.icon}
          size={item.iconSize || 26}
          style={{
            bottom: buttonAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, 8] }),
            color: isTabActive ? activeTextColor : inactiveTextColor,
          }} />

        {item.title && isTabActive &&
          <Animated.Text style={[
            styles.textLabel,
            {
              color: activeTextColor,
              opacity: buttonAnimation,
              transform: [{
                scale: buttonAnimation
              }]
            }
          ]}>
          {item.title}
          </Animated.Text>
        }

      </Animated.View>
    </TouchableNativeFeedback>
    );
  },

  render() {
    const { tabs, backgroundColor, style } = this.props;

    return (
      <View>
        <View style={[styles.tabs, { backgroundColor: backgroundColor || null }, style]}>
          {tabs.map((tab, i) => this.renderTabOption(tab, i))}
        </View>
      </View>
      );
  },
});

module.exports = MdIconTabBar;
