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
import typography from '../../style/typography';

const IOS = Platform.OS === 'ios';

export default ProfileLink = ({ item, index, onPress }) => {

  return (
  <PlatformTouchable
    key={index}
    underlayColor={'#eee'}
    activeOpacity={0.95}
    delayPressIn={0}
    onPress={onPress}
  >
    <View style={styles.profileLink}>
      <View style={styles.inner}>
        <View style={styles.iconWrap}>
          <Icon style={styles.icon} name={item.icon} />
        </View>
        <View style={styles.titles}>
          <Text style={styles.title}>{item.title}</Text>
          {item.subtitle && <Text style={styles.subtitle}>{item.subtitle}</Text>}
        </View>
      </View>
    </View>
  </PlatformTouchable>
);

}


const styles = StyleSheet.create({

  profileLink:{
    backgroundColor: theme.white,
    flex: 1,
    marginBottom: 20,
    padding: 0,
    elevation: 2,
    shadowColor: theme.secondaryDark,
    shadowOpacity: 0.07,
    shadowRadius: 7,
    shadowOffset: {
      height: 5,
      width: 0
    },
  },
  inner: {
    flex: 1,
    padding: 20,
    paddingVertical: 50,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.transparent,
  },
  iconWrap: {
    width: 60,
    height: 60,
    backgroundColor: theme.lightgreen,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  icon: {
    fontSize: 35,
    color: theme.secondary,
    alignItems: 'center',
  },
  titles: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: typography.h1(),
  subtitle: typography.paragraph({ textAlign: 'center' }),

});
