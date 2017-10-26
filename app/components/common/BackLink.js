import React, { Component, PropTypes } from 'react';
import {
  View,
  WebView,
  StyleSheet,
  Platform,
} from 'react-native';

import PlatformTouchable from './PlatformTouchable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';
const IOS = Platform.OS === 'ios';

export default BackLink = ({ onPress }) => (
  <View style={styles.backLink}>
    <PlatformTouchable
      delayPressIn={0}
      onPress={onPress}
      background={PlatformTouchable.SelectableBackgroundBorderless()}
    >
      <View style={styles.backLinkText}>
        <Icon name="arrow-back" size={28} style={styles.backLinkIcon}  />
      </View>
    </PlatformTouchable>
  </View>
);

var styles = StyleSheet.create({
  backLink: {
    position: 'absolute',
    left: 23,
    top: IOS ? 33 : 23,
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, .5)',
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  backLinkText: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    // width: 40,
    // height: 40,
    // borderRadius: 20,
    // backgroundColor: 'transparent'
  },
  backLinkIcon: {
    color: theme.primary
  },
});