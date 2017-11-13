'use strict';

import React, { PropTypes, Component } from 'react';
import { Animated, Dimensions, View, StyleSheet } from 'react-native';
import autobind from 'autobind-decorator';
import { noop } from 'lodash';

import PlatformTouchable from './PlatformTouchable';
import Text from './MyText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: theme.white,
    elevation: 3,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    paddingRight: 0,
  },
  iconWrap: {
    borderRadius: 28,
    width: 56,
    height: 56,
    marginRight: 0,
  },
  rightIconWrap: {
    borderRadius: 28,
    width: 56,
    height: 56,
    marginRight: 0,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  iconText: {
    color: theme.primary,
    fontSize: 25,
  },
  rightIcon: {
    fontSize: 20,
    color: theme.primary
  },
  titleWrap: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  title: {
    color: theme.primary,
    fontSize: 20,
    lineHeight: 26,
  },
  subtitle: {
    color: theme.dark,
    fontSize: 14,
    lineHeight: 20,
  }
});

class ScrollHeader extends Component {
  render() {
    const toolbarStyles = [styles.toolbar];
    const {
      title,
      subtitle,
      icon,
      onIconClick,
      actions,
      elevation,
      rightIcon,
      onRightIconClick,
    } = this.props;

    return (

      <View style={[styles.toolbar, { elevation, paddingRight: rightIcon ? 0 : 20 }]}>
        <View style={styles.iconWrap}>
          <PlatformTouchable
            delayPressIn={0}
            onPress={onIconClick}
            background={PlatformTouchable.SelectableBackgroundBorderless()}
          >
            <View style={styles.icon}>
              <Icon name={icon} style={styles.iconText} />
            </View>
          </PlatformTouchable>
        </View>
        <View style={styles.titleWrap}>
          {!!title && <Text style={styles.title}>{title}</Text>}
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {rightIcon &&
        <View style={styles.rightIconWrap}>
          <PlatformTouchable
            delayPressIn={0}
            onPress={onRightIconClick}
            background={PlatformTouchable.SelectableBackgroundBorderless()}
          >
            <View style={styles.icon}>
              <Icon name={rightIcon} style={[styles.iconText, styles.rightIcon]} />
            </View>
          </PlatformTouchable>
        </View>
        }
      </View>
    );
  }
}

ScrollHeader.defaultProps = {
  icon: 'arrow-back',
  title: null,
  subtitle: null,
  elevation: 3,
  rightIcon: null,
  onRightIconClick: noop,
}

export default ScrollHeader;
