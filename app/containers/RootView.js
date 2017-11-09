'use strict';

import React, { Component } from 'react';
import { Platform, StatusBar } from 'react-native';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import createLoggerMiddleware from 'redux-logger';
import loggerConfig from '../utils/loggerConfig';
import * as reducers from '../reducers';
import MainView from './MainView';
import { checkUserLogin } from '../concepts/auth';
import { initializeUsersCitySelection } from '../concepts/map';
import { startLocationWatcher, stopLocationWatcher } from '../concepts/location';

const IOS = Platform.OS === 'ios';

const middlewares = [thunk];
if (__DEV__) {
  // Temp solution due android bug
  // where dismissing makes app unusable
  console.disableYellowBox = true;

  // Disabling logging might help performance as XCode prints the whole objects
  // without respecing the collapsed parameter
  const logger = createLoggerMiddleware(loggerConfig)
  middlewares.push(logger);
}

const createStoreWithMiddleware = applyMiddleware.apply(this, middlewares)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);


class RootView extends Component {
  componentDidMount() {
    // Location watcher
    // store.dispatch(startLocationWatcher());

    // Get login info
    Promise.resolve(store.dispatch(checkUserLogin()))
    .then(() => store.dispatch(initializeUsersCitySelection()))

    // Statusbar style
    if (IOS) {
      StatusBar.setHidden(false);
      StatusBar.setBarStyle('dark-content');
    }
  }

  // componentWillUnmount() {
  //   store.dispatch(stopLocationWatcher());
  // }

  render() {
    return (
      <Provider store={store}>
        <MainView />
      </Provider>
    );
  }
}

export default RootView;
