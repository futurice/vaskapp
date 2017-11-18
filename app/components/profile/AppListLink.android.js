  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Image,
} from 'react-native';
import { noop } from 'lodash'

import PlatformTouchable from '../common/PlatformTouchable';
import Text from '../common/MyText';

import theme from '../../style/theme';
import typography from '../../style/typography';

const AppListLink = ({ app, navigator, appLinkPress }) => (
  <View style={styles.listItem} key={app.get('id')}>
    <PlatformTouchable
      underlayColor={'#eee'}
      activeOpacity={0.95}
      delayPressIn={0}
      onPress={() => appLinkPress(app, navigator)}
      background={PlatformTouchable.SelectableBackgroundBorderless()}
    >
      <View style={styles.appIcon}>
        <Image style={styles.appIconImage} source={{ uri: app.get('imageUrl') }} />
      </View>
    </PlatformTouchable>
    <View style={styles.listItemTitles}>
      <Text style={styles.listItemText}>{app.get('name')}</Text>
      {app.get('description') && <Text style={styles.listItemDescription}>{app.get('description')}</Text>}
    </View>
  </View>
);


const styles = StyleSheet.create({
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
    shadowColor: theme.secondaryDark,
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: {
      height: 3,
      width: 0
    },
  },
  appIconImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  listItem: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 10,
    paddingTop: 0,
    paddingBottom: 0,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  listItemTitles: {
    paddingHorizontal: 0,
    width: 110,
    flexDirection: 'column',
  },
  listItemText: typography.h2({
    marginBottom: 1,
    letterSpacing: 0.5,
  }),
  listItemDescription: typography.paragraph({
    marginBottom: 0,
    fontSize: 12,
    lineHeight: 17,
  })
});


export default AppListLink;