'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  PropTypes
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Text from '../common/MyText';
import theme from '../../style/theme';
import { isIphoneX } from '../../services/device-info';


const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: theme.white,
    height: isIphoneX ? 70 : 60,
    flexDirection: 'row',
    paddingTop: isIphoneX ? 30 : 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    fontSize: 20,
    paddingLeft: isIphoneX ? 20 : 10,
    paddingRight: 10,
    color: theme.primary
  },
  title:{
    paddingRight:15,
    fontSize: 17,
    lineHeight: 25,
    top: 5,
    color: theme.primary,
    fontWeight: 'normal'
  },
  buttonPush: {
    width: isIphoneX ? 35 : 25,
  }
});

class EventDetailToolbar extends Component {
  propTypes: {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string,
    iconClick: PropTypes.func
  }

  render() {
    const touchableProps = {};
    if (this.props.iconClick) {
      touchableProps.onPress = this.props.iconClick;
    }

    return (
      <View style={styles.toolbar}>
        <TouchableOpacity {...touchableProps}>
          {
            this.props.icon
            ? <Icon style={styles.icon} name={this.props.icon} />
            : <View/>
          }
        </TouchableOpacity>
        <Text style={styles.title}>{this.props.title}</Text>
        <View style={styles.buttonPush} />
      </View>

    );
  }
}

module.exports = EventDetailToolbar;
