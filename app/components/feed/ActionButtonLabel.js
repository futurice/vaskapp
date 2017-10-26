'use strict';

import React, { Component } from 'react';
import { Animated, View, Platform, StyleSheet } from 'react-native';

import theme from '../../style/theme';
import Text from '../common/MyText';

const styles = StyleSheet.create({
  label:{

    padding: 6,
    top: 48,
    height: Platform.OS === 'ios' ? 26 : 27,
    backgroundColor: 'transparent',
    right: 0
  },
  labelText:{
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center',
    fontWeight: 'normal',
    color: theme.primary,
  }
});

class ActionButtonLabel extends Component {
  render() {
    const combinedStyle = [styles.label];
    const { extraStyle, children, additionalLabel } = this.props;

    if (extraStyle) {
      combinedStyle.push(extraStyle);
    }

    return (
      <Animated.View style={combinedStyle}>
        <Text style={styles.labelText}>{children}</Text>
      </Animated.View>

    );
  }
}

export default ActionButtonLabel;
