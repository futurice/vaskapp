'use strict';

import React, { Component, PropTypes } from 'react';
import {
  ToolbarAndroid,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: theme.white,
    height: 56,
    elevation: 1,
  }
});

class ToolBar extends Component {
  render() {
    const { leftIconClick, leftIcon, title, style, titleColor, iconColor } = this.props;

    return (
      <Icon.ToolbarAndroid
        onIconClicked={leftIconClick}
        navIconName={leftIcon}
        titleColor={titleColor || theme.secondary}
        iconColor={iconColor || theme.secondary}
        style={[styles.toolbar, style || {}]}
        title={title}
      />
    );
  }
}

export default ToolBar;
