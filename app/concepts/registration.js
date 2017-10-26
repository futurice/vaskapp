import DeviceInfo from 'react-native-device-info';
import { AsyncStorage, Platform } from 'react-native';
import _ from 'lodash';
import { fromJS, Map } from 'immutable';
import { createSelector } from 'reselect';

import api from '../services/api';
import { AUTH0_CLIENTID, AUTH0_DOMAIN } from '../../env';
import STORAGE_KEYS from '../constants/StorageKeys';
import namegen from '../services/namegen';
import { createRequestActionTypes } from '../actions';

import { changeTab } from '../actions/navigation';
import { getTeams } from '../reducers/team';
import { SET_TOKEN } from './auth';
import { NO_SELECTED_CITY_FOUND } from './city';
import { fetchActionTypes } from './competition';

import Tabs from '../constants/Tabs';

const IOS = Platform.OS === 'ios';

// # Action types
const {
  CREATE_USER_REQUEST,
  CREATE_USER_SUCCESS,
  CREATE_USER_FAILURE
} = createRequestActionTypes('CREATE_USER');
const {
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE
} = createRequestActionTypes('GET_USER');

const {
  POST_PROFILE_PICTURE_REQUEST,
  POST_PROFILE_PICTURE_SUCCESS,
  POST_PROFILE_PICTURE_FAILURE
} = createRequestActionTypes('POST_PROFILE_PICTURE');

const OPEN_REGISTRATION_VIEW = 'OPEN_REGISTRATION_VIEW';
const CLOSE_REGISTRATION_VIEW = 'CLOSE_REGISTRATION_VIEW';
const UPDATE_NAME = 'UPDATE_NAME';
const UPDATE_USER_INFO = 'UPDATE_USER_INFO';
const UPDATE_PROFILE = 'UPDATE_PROFILE';
const RESET = 'RESET';
const SELECT_TEAM = 'SELECT_TEAM';
const CLOSE_TEAM_SELECTOR = 'CLOSE_TEAM_SELECTOR';
const DISMISS_INTRODUCTION = 'DISMISS_INTRODUCTION';


// # Selectors
export const getUserId = state => state.registration.getIn(['profile','userId']);
export const getUserName = state => state.registration.getIn(['profile','name']);
export const getUserInfo = state => state.registration.getIn(['profile','info']);
export const getUserImage = state => state.registration.getIn(['profile','profilePicture']);
export const getUserTeamId = state => state.registration.getIn(['profile','team'], 0);
export const getToken = state => state.registration.get('userToken', fromJS({})) || fromJS({});
export const getUserTeam = createSelector(getUserTeamId, getTeams,
  (teamId, teams) => teams.find(item => item.get('id') === teamId)) || fromJS({});

export const getUser = createSelector(
  getUserId, getUserName, getUserInfo, getUserTeamId, getUserTeam, getUserImage,
  (id, name, info, teamId, teamName, image) => fromJS({
    id,
    name,
    info,
    teamId,
    teamName,
    image
  })
);

export const isUserLoggedIn = createSelector(getToken, token => !!token && !token.isEmpty())


// # Action creators
export const openRegistrationView = () => ({ type: OPEN_REGISTRATION_VIEW });
export const closeRegistrationView = () => ({ type: CLOSE_REGISTRATION_VIEW });
export const dismissIntroduction = () => ({ type: DISMISS_INTRODUCTION });

export const putUser = () => {
  return (dispatch, getState) => {
    dispatch({ type: CREATE_USER_REQUEST });
    const uuid = DeviceInfo.getUniqueID();
    const state = getState();

    const name = getUserName(state);
    const info = getUserInfo(state);;
    const team = getUserTeamId(state);
    const profilePicture = getUserImage(state);

    return api.putUser({ uuid, info, name, team, profilePicture })
      .then(response => {
        dispatch({ type: CREATE_USER_SUCCESS });
        dispatch({ type: CLOSE_REGISTRATION_VIEW });
        // Works only in IOS
        if (IOS) {
          dispatch(changeTab(Tabs.SETTINGS));
        }
      })
      .catch(error => dispatch({ type: CREATE_USER_FAILURE, error: error }));
  };
};

export const selectTeam = teamId => (dispatch) => {
  dispatch({ type: CLOSE_TEAM_SELECTOR });
  dispatch({ type: SELECT_TEAM, payload: teamId });
};

export const updateName = name => ({ type: UPDATE_NAME, payload: name });
export const updateUserInfo = info => ({ type: UPDATE_USER_INFO, payload: info });

export const updateProfile = payload => ({ type: UPDATE_PROFILE, payload })

export const reset = () => {
  return { type: RESET };
};

export const generateName = () => {
  return (dispatch, getState) => {
    const currentTeamId = getState().registration.get('selectedTeam');

    if (currentTeamId) {
      const teams = getState().team.get('teams').toJS();
      const selectedTeam = _.find(teams, ['id', currentTeamId]);
      if (selectedTeam) {
        dispatch({ type: UPDATE_NAME, payload: namegen.generateName(selectedTeam.name) });
      }
    }
  };
};

export const fetchUser = () => {
  return dispatch => {
    dispatch({ type: GET_USER_REQUEST });
    const uuid = DeviceInfo.getUniqueID();
    return api.getUser(uuid)
      .then(user => {
        dispatch({ type: GET_USER_SUCCESS, payload: user });
      })
      .catch(error => {
        dispatch({ type: GET_USER_FAILURE, error: error });
      });
  };
};


export const postProfilePicture = imageData => {
  return (dispatch, getState) => {
    dispatch({ type: POST_PROFILE_PICTURE_REQUEST });
    const uuid = DeviceInfo.getUniqueID();

    // These are being sent just because API is WIP
    const name = getState().registration.get('name');
    const team = getState().registration.get('selectedTeam');

    return api.putUser({ uuid, name, team, imageData })
      .then(response => {
        Promise.resolve(dispatch(getUser()))
        .then(() => {
          dispatch({ type: POST_PROFILE_PICTURE_SUCCESS });
        });
      })
      .catch(error => dispatch({ type: POST_PROFILE_PICTURE_FAILURE, error: error }));
  };
}


const initialState = fromJS({
  profile: {
    id: null,
    name: null,
    info: null,
    profilePicture: null,
    team: null,
    uuid: null,
  },

  // Todo get rid of
  selectedTeam: 0,
  name: '',
  info: '',
  profilePicture: '',

  // Valid flags
  isRegistrationViewOpen: false,
  isLoading: false,
  isError: false,
  isIntroductionDismissed: false,
  userToken: {},
});

export default function registration(state = initialState, action) {
  switch (action.type) {
    case OPEN_REGISTRATION_VIEW:
      return state.set('isRegistrationViewOpen', true);

    case CLOSE_REGISTRATION_VIEW:
      return state.merge({
        isIntroductionDismissed: false,
        isRegistrationViewOpen: false
      });

    case DISMISS_INTRODUCTION:
      return state.set('isIntroductionDismissed', true);

    case UPDATE_NAME:
      return state.setIn(['profile', 'name'], action.payload);

    case UPDATE_USER_INFO:
      return state.setIn(['profile', 'info'], action.payload);

    case UPDATE_PROFILE: {
      const profile = state.get('profile');
      return state.set('profile', profile.merge(fromJS(action.payload)));
    }

    case SELECT_TEAM:
      return state.setIn(['profile', 'team'], action.payload);
    case RESET:
      return state.merge({
        name: '',
        selectedTeam: 0
      });

    case CREATE_USER_REQUEST:
      return state.merge({
        isLoading: true,
        isError: false
      });

    case GET_USER_REQUEST:
      return state.set('isLoading', true);

    case CREATE_USER_SUCCESS:
      return state.merge({
        isLoading: false,
        isError: false
      });

    case CREATE_USER_FAILURE:
    case GET_USER_FAILURE:
      return state.merge({
        isLoading: false,
        isError: true
      });

    case NO_SELECTED_CITY_FOUND:
      return state.merge({
        isRegistrationViewOpen: action.payload
      })

    case GET_USER_SUCCESS:
      return state.merge({
        profile: fromJS(action.payload),
        isLoading: false,
      });

    case SET_TOKEN:
      return state.set('userToken', fromJS(action.payload));

    default:
      return state;
  }
}
