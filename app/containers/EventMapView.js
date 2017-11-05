'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Platform
} from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import autobind from 'autobind-decorator';

import UserMap from '../components/map/UserMap';
import analytics from '../services/analytics';
import sceneConfig from '../utils/sceneConfig';
import theme from '../style/theme';

const VIEW_NAME = 'MapView';

const styles = StyleSheet.create({
  navigator: {
    paddingTop: Platform.OS === 'ios' ? 20 : 0
  },
  navbar: {
    backgroundColor: theme.secondary,
    height: 62,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center'
  }
});

var _navigator; // eslint-disable-line

class EventMapView extends Component {
  componentDidMount() {
    analytics.viewOpened(VIEW_NAME);
  }

  @autobind
  renderScene(route, navigator) {
    _navigator = navigator;
    if (route.component) {
      const RouteComponent = route.component;
      return <RouteComponent route={route} {...this.props} />
    }
  }

  render() {
    return (
      <Navigator
        style={styles.navigator}
        initialRoute={{
          component: UserMap,
          name: 'Map'
        }}

        renderScene={this.renderScene}
        configureScene={() => sceneConfig}
      />
    );
  }
}

export default EventMapView;
