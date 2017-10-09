import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
  StyleSheet
} from 'react-native';

import PlatformTouchable from '../../common/PlatformTouchable';
import theme from '../../../style/theme';


class CalloutButton extends Component {
  constructor(props) {
    super(props);

    this.state = { anim: new Animated.Value(0) };
  }

  componentDidMount() {
    setTimeout(() => {
      Animated
        .timing(this.state.anim, { duration: 400, easing: Easing.elastic(1), toValue: 1 })
        .start();
    }, 750)
  }

  render() {
    const { children, onPress } = this.props;
    const buttonAnimation = { transform: [{ scale: this.state.anim }]};

    return (
      <Animated.View style={[styles.buttonWrap, buttonAnimation]}>
        <PlatformTouchable
          activeOpacity={1}
          style={styles.button}
          onPress={onPress}
        >
          {children}
        </PlatformTouchable>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  buttonWrap: {
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: -45,
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.white,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      height: 10,
      width: 0
    }
  }
});

export default CalloutButton;
