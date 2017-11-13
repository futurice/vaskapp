import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Easing,
  StyleSheet,
  Platform,
} from 'react-native';

import AnimateMe from '../../AnimateMe';
import PlatformTouchable from '../../common/PlatformTouchable';
import theme from '../../../style/theme';
const IOS = Platform.OS === 'ios';

class CalloutButton extends Component {
  render() {
    const { children, onPress } = this.props;

    return (
      <AnimateMe
        style={styles.buttonWrap}
        animationType={'fade-from-bottom'}
        duration={250}
        delay={500}
      >
        <PlatformTouchable
          activeOpacity={1}
          style={styles.button}
          onPress={onPress}
        >
          {children}
        </PlatformTouchable>
      </AnimateMe>
    );
  }
}

const styles = StyleSheet.create({
  buttonWrap: {
    zIndex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: IOS ? -45 : 50,
    width: 56,
    height: 56,
    borderRadius: 28,
    flex: 1,
    elevation: 2,
    backgroundColor: theme.lightgreen,
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
