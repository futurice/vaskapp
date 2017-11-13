'use strict'

import React, { Component } from 'react';
import {
  View,
  StatusBar,
  BackHandler,
} from 'react-native'
import { Navigator } from 'react-native-deprecated-custom-components';

import _ from 'lodash';
import { connect } from 'react-redux';

import { isUserLoggedIn } from '../concepts/registration';
import { isLoadingAppAuth } from '../concepts/auth';

import AndroidTabNavigation from './Navigation';
import AppIntroView from '../components/registration/AppIntroView';
import TeamSelector from '../components/registration/TeamSelector';
import ProfileEditor from '../components/registration/ProfileEditor';
import TextActionView from '../components/actions/TextActionView';

import errorAlert from '../utils/error-alert';

const theme = require('../style/theme');

let _navigator;
BackHandler.addEventListener('hardwareBackPress', () => {
  if (_navigator && _navigator.getCurrentRoutes().length > 1) {
    _navigator.pop();
    return true;
  }
  return false;
});

class MainView extends Component {
  renderScene(route, navigator) {
    _navigator = navigator;
    if (route.component) {
      const RouteComponent = route.component;
      return <RouteComponent navigator={_navigator} route={route} {...this.props} />
    }
  }

  render() {
    const { showCitySelection, errors, dispatch, isUserLogged, isLoginLoading } = this.props;
    const showUserLoginView = !isUserLogged || isLoginLoading;

    const immutableError = errors.get('error');
    if (immutableError) {
      const error = immutableError.toJS();
      errorAlert(dispatch, _.get(error, 'header'), _.get(error, 'message'));
    }

    if (showUserLoginView) {
      return <AppIntroView />;
    }

    return (
      <View style={{ flex:1 }}>
        <StatusBar backgroundColor={theme.grey1} barStyle="dark-content" />

        <Navigator
          initialRoute={{
            component: AndroidTabNavigation,
            name: 'Futuricean'
          }}
          renderScene={this.renderScene}
          configureScene={() => ({
            ...Navigator.SceneConfigs.FloatFromBottomAndroid
          })}
        />
        <ProfileEditor />
        <TextActionView />
        <TeamSelector />
      </View>
    )
  }
}

const select = state => {
  return {
    errors: state.errors,
    currentTab: state.navigation.get('currentTab'),
    isUserLogged: isUserLoggedIn(state),
    isLoginLoading: isLoadingAppAuth(state),
  }
};

export default connect(select)(MainView);
