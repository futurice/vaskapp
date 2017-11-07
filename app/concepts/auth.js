import { AsyncStorage } from 'react-native';
import Auth0 from 'react-native-auth0';
import { fromJS } from 'immutable';
import md5 from 'blueimp-md5';

import api from '../services/api';
import {
  updateProfile,
  putUser,
  fetchUser,
  openLoginTeamSelector,
  closeLoginTeamSelector,
} from '../concepts/registration';
import { fetchAppContent } from './app';
import { getTeams } from '../reducers/team';
import { createRequestActionTypes } from '../actions';

import { AUTH0_CLIENTID, AUTH0_DOMAIN } from '../../env';
import STORAGE_KEYS from '../constants/StorageKeys';

// # Action types
export const SET_TOKEN = 'SET_TOKEN';
export const {
  REFRESH_TOKEN_REQUEST,
  REFRESH_TOKEN_SUCCESS,
  REFRESH_TOKEN_FAILURE
} = createRequestActionTypes('REFRESH_TOKEN');
export const SHOW_LOGIN_ERROR = 'SHOW_LOGIN_ERROR';
export const HIDE_LOGIN_ERROR = 'HIDE_LOGIN_ERROR';
export const SHOW_LOGIN_LOADER = 'SHOW_LOGIN_LOADER';
export const HIDE_LOGIN_LOADER = 'HIDE_LOGIN_LOADER';

const auth0 = new Auth0({ domain: AUTH0_DOMAIN, clientId: AUTH0_CLIENTID });

// # Selectors
export const isRefreshingToken = state => state.auth.get('isRefreshingToken', false);
export const isLoginFailed = state => state.auth.get('isLoginFailed', false);
export const isLoadingAppAuth = state => state.auth.get('isLoadingAppAuth', false);

// # Actions

// Clear login: AsyncStorage.clear();

const setTokenToStore = payload => ({ type: SET_TOKEN, payload });

export const openLoginView = () => (dispatch, getState) => {
  const state = getState();
  const teams = getTeams(state);
  let tokens;

  // Hide possible login error
  dispatch({ type: HIDE_LOGIN_ERROR });
  dispatch({ type: SHOW_LOGIN_LOADER });
  dispatch(startLoginProcess());

  auth0
  .webAuth
  .authorize({ scope: 'openid profile email'/*, audience: `https://${AUTH0_DOMAIN}/userinfo` */})
  .then((credentials) => {
    tokens = credentials;
    const { accessToken } = credentials;

    return auth0
      .auth
      .userInfo({ token: accessToken })
  })
  .then(profile => {
    const userFields = {
      profilePicture: profile.picture,
      name: profile.name,
      selectedTeam: 1,
    };

    // Create userToken from email
    const email = profile.emailVerified ? profile.email : null;
    tokens.userToken = md5((email || '').toLowerCase());

    // Save profile to state
    // (we don't have user id yet, because user is not created)
    Promise.resolve(dispatch(updateProfile(userFields)))
    .then(() => {
      // Save profile to Storage
      AsyncStorage.setItem(STORAGE_KEYS.token, JSON.stringify(tokens), () => {
        // Set storage info to state
        // needed for user creation already (putUser)
        dispatch(setTokenToStore(tokens));

        // If user already exists
        dispatch(fetchUser())
        .then(user => {
          // If user is not found create user
          if (!user) {
            return dispatch(openLoginTeamSelector())
          }

          dispatch(endLoginProcess());
          return Promise.resolve();
        })
        .then(() => dispatch(onLoginReady()))
        .catch(() => dispatch(onLoginError()))
      });
    });
  })
  .catch((err) => dispatch(onLoginError()));
}

// Need to keep flags of login completion in order to make sure user is cretated
const startLoginProcess = () => dispatch => AsyncStorage.setItem(STORAGE_KEYS.loginInProgress, 'true');
const endLoginProcess = () => dispatch => AsyncStorage.removeItem(STORAGE_KEYS.loginInProgress);

export const saveInitialTeamSelection = () => dispatch =>
  dispatch(putUser())
    .then(dispatch(closeLoginTeamSelector()))
    .then(dispatch(endLoginProcess()))
    .then(dispatch(onLoginReady()));

const onLoginReady = () => dispatch => {
  return dispatch(fetchAppContent()).then(() => dispatch({ type: HIDE_LOGIN_LOADER }));
}

const onLoginError = () => dispatch => {
  dispatch(logoutUser());
  dispatch({ type: SHOW_LOGIN_ERROR })
  dispatch({ type: HIDE_LOGIN_LOADER });
}


const updateAuthToken = (idToken) => dispatch => {
  dispatch({ type: REFRESH_TOKEN_REQUEST });

  // Get current token
  AsyncStorage.getItem(STORAGE_KEYS.token, (err, token) => {
    if (!token) {
      return;
    }

    // Merge new token with current token information
    const currentToken = JSON.parse(token);
    const newToken = Object.assign(currentToken, { idToken });

    // Update token to storage
    AsyncStorage.setItem(STORAGE_KEYS.token, JSON.stringify(newToken), () => {
      dispatch({ type: REFRESH_TOKEN_SUCCESS, newToken });
      dispatch(fetchAppContent());
    });
  });
}


export const refreshAuthToken = () => (dispatch, getState) => {
  return;
  //
  const state = getState();
  const refreshingToken = isRefreshingToken(state);

  // Prevent multiple refreshing actions
  if (refreshingToken) {
    return;
  }

  return AsyncStorage.getItem(STORAGE_KEYS.token).then((token) => {
    const tokenObj = token ? JSON.parse(token) : {};
    const { refreshToken } = tokenObj;

    dispatch({ type: REFRESH_TOKEN_REQUEST });

    return api.refreshAuthToken(refreshToken)
      .then(response => {
        const { id_token } = response;

        dispatch(updateAuthToken(id_token));
        dispatch({ type: REFRESH_TOKEN_SUCCESS });
      })
      .catch(() => dispatch({ type: REFRESH_TOKEN_FAILURE }));
  });
}

// # Logout
// Remove user from AsyncStorage and state
export const logoutUser = () => (dispatch) => {
  AsyncStorage.removeItem(STORAGE_KEYS.token, () => {
    dispatch(setTokenToStore(null));
    AsyncStorage.clear();
  });
}

export const checkUserLogin = () => (dispatch) => {
  // Check that login is not in progress
  // This can happen when user has closed app
  // on login process before user is created but token already is stored
  AsyncStorage.getItem(STORAGE_KEYS.loginInProgress, (error, loginInProgress) => {
    if (loginInProgress) {
      return dispatch(logoutUser());
    }

    // Check token
    AsyncStorage.getItem(STORAGE_KEYS.token, (err, token) => {
      if (token) {
        const tokenObj = JSON.parse(token);
        dispatch(setTokenToStore(tokenObj));

        // Get all app content
        return dispatch(fetchAppContent());
      }
    });
  });
};



const initialState = fromJS({
  isRefreshingToken: false,
  isLoginFailed: false,
  isLoadingAppAuth: false,
});

export default function auth(state = initialState, action) {
  switch (action.type) {
    case REFRESH_TOKEN_REQUEST:
      return state.set('isRefreshingToken', true);

    case REFRESH_TOKEN_SUCCESS:
    case REFRESH_TOKEN_FAILURE:
      return state.set('isRefreshingToken', false);

    case SHOW_LOGIN_ERROR:
      return state.set('isLoginFailed', true);

    case HIDE_LOGIN_ERROR:
      return state.set('isLoginFailed', false);

    case SHOW_LOGIN_LOADER:
      return state.set('isLoadingAppAuth', true);

    case HIDE_LOGIN_LOADER:
      return state.set('isLoadingAppAuth', false);

    default:
      return state;
  }
}
