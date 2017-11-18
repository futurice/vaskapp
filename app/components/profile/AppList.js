  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import React, { Component, PropTypes } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import { noop } from 'lodash'

import Icon from 'react-native-vector-icons/MaterialIcons';
import PlatformTouchable from '../common/PlatformTouchable';
import Button from '../common/Button';
import Text from '../common/MyText';
import theme from '../../style/theme';
import typography from '../../style/typography';
import AppTypes from '../../constants/AppTypes';

import BlogList from '../blog/BlogList';
import WebViewer from '../webview/WebViewer';
import Section from './Section';
import AppListLink from './AppListLink';
import { trackEvent } from '../../services/analytics';

const IOS = Platform.OS === 'ios';

const appLinkPress = (app, navigator) => {
  const url = app.get('url');
  const type = app.get('type');
  const name = app.get('name');

  let component;
  let params = {};


  trackEvent('app', 'open', name)
  switch(type) {
    case AppTypes.WEBAPP: {
      component = WebViewer;
      params.showOpenLink = true;
      break;
    }

    case AppTypes.RSS: {
      component = BlogList;
      break;
    }

    case AppTypes.LINK: {
      Linking.openURL(url);
      return;
    }

    default: {
      console.log('Not supported app type', type);
    }
  }

  // Open component
  if (component) {
    navigator.push({ component, name, url, showName: true, ...params })
  }
}

class AppList extends Component {
  render() {
    const { title, apps, key, navigator } = this.props;
    return (
      <Section title={title} key={key}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} >
          <View style={styles.appGroupList}>
            {apps.map((app) => <AppListLink app={app} appLinkPress={appLinkPress} navigator={navigator} /> )}
          </View>
        </ScrollView>
      </Section>
    );
  }
}


const styles = StyleSheet.create({
  appGroupList: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 15,
  },
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
    marginBottom: IOS ? 3 : 1,
    letterSpacing: 0.5,
  }),
  listItemDescription: typography.paragraph({
    marginBottom: 0,
    fontSize: 12,
    lineHeight: IOS ? 13 : 17,
  })
});

export default AppList;
