import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Navigator } from 'react-native-deprecated-custom-components';
import { get } from 'lodash';
import { connect } from 'react-redux';

import sceneConfig from '../utils/sceneConfig';
import NavRouteMapper from '../components/common/navbarRouteMapper';
import errorAlert from '../utils/error-alert';

import { isUserLoggedIn } from '../concepts/registration';
import { isLoadingAppAuth } from '../concepts/auth';
import { getUnreadConversationCount } from '../concepts/conversations';
import { isIphoneX } from '../services/device-info';

import IOSTabNavigation from './Navigation';
import AppIntroView from '../components/registration/AppIntroView';
import ProfileEditor from '../components/registration/ProfileEditor';
import TeamSelector from '../components/registration/TeamSelector';
import CheckInActionView from '../components/actions/CheckInActionView';
import TextActionView from '../components/actions/TextActionView';
import LightBox from '../components/lightbox/Lightbox';

const theme = require('../style/theme');

class MainView extends Component {
  renderScene(route, navigator) {
    if (route.component) {
      const RouteComponent = route.component;
      return <RouteComponent navigator={navigator} route={route} {...this.props} />;
    }
  }

  render() {
    const { showCitySelection, errors, dispatch,
      unreadConversationCount, isUserLogged, isLoginLoading } = this.props;
    const showUserLoginView = !isUserLogged || isLoginLoading;

    const immutableError = errors.get('error');
    if (immutableError) {
      const error = immutableError.toJS();
      errorAlert(dispatch, get(error, 'header'), get(error, 'message'));
    }

    if (showUserLoginView) {
      return <AppIntroView />;
    }

    return (
      <View style={{ flex:1 }}>
        <Navigator
          style={styles.navigator}
          navigationBar={
            <Navigator.NavigationBar
              style={styles.navbar}
              routeMapper={NavRouteMapper(this.props)} />
          }
          initialRoute={{
            component: IOSTabNavigation,
            name: 'Vaskapp'
          }}
          renderScene={this.renderScene}
          configureScene={() => sceneConfig}
        />

        { /* Modals */}
        <ProfileEditor />
        <TextActionView />
        <TeamSelector />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navigator: {
    paddingTop: isIphoneX ? 57 : 42,
    paddingBottom:0,
  },
  navbar: {
    backgroundColor: theme.white,
    height: 62,
    top: isIphoneX ? 15 : 0,
    paddingBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    // shadowColor: theme.secondaryDark,
    // shadowOpacity: 0.09,
    // shadowRadius: 7,
    // shadowOffset: {
    //   height: 5,
    //   width: 0
    // },
  }
});

const select = state => {
  return {
    errors: state.errors,
    currentTab: state.navigation.get('currentTab'),
    isUserLogged: isUserLoggedIn(state),
    isLoginLoading: isLoadingAppAuth(state),
    unreadConversationCount: getUnreadConversationCount(state),
  }
};

export default connect(select)(MainView);
