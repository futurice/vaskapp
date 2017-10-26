  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import React, { Component, PropTypes } from 'react';
import {
  Platform,
  StyleSheet,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import PlatformTouchable from '../common/PlatformTouchable';
import Button from '../common/Button';
import Text from '../common/MyText';
import theme from '../../style/theme';

const IOS = Platform.OS === 'ios';

export default SettingsLink = ({ item, index, onPress }) => (
  <PlatformTouchable
    key={index}
    underlayColor={'#eee'}
    activeOpacity={0.95}
    delayPressIn={0}
    style={styles.listItemButton}
    onPress={onPress}
  >
    <View style={styles.listItemButton}>
      <View style={styles.listItem}>
        <Icon style={styles.listItemIcon} name={item.icon} />
        <View style={styles.listItemTitles}>
          <Text style={styles.listItemText}>{item.title}</Text>
          {item.subtitle && <Text style={styles.listItemSubtitle}>{item.subtitle}</Text>}
        </View>
      </View>
    </View>
  </PlatformTouchable>
);


const styles = StyleSheet.create({
  listItemButton:{
    backgroundColor: theme.white,
    flex: 1,
    padding: 0,
  },
  listItem: {
    flex: 1,
    padding: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemIcon: {
    fontSize: 17,
    marginRight: 20,
    color: theme.dark,
  },
  listItemText: {
    fontSize: 14,
    letterSpacing: 0,
    color: theme.dark,
    top: IOS ? 3 : 0,
  }

});
