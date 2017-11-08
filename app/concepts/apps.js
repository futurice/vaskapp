import api from '../services/api';
import { createSelector } from 'reselect';
import { List, fromJS } from 'immutable';
import { has } from 'lodash';
import { createRequestActionTypes } from '../actions';
import LoadingStates from '../constants/LoadingStates';
import AppTypes from '../constants/AppTypes';


export const getAppsData = state => state.apps.get('apps', List());
export const isLoadingApps = state => state.apps.get('listState') === LoadingStates.LOADING;

// Filter supported AppTypes
export const getApps = createSelector(
  getAppsData, (apps) =>
    apps.filter((app) => has(AppTypes, [app.get('type')]))
);


// # Action creators & types
const SET_APPS = 'SET_APPS';
const {
  GET_APPS_REQUEST,
  GET_APPS_SUCCESS,
  GET_APPS_FAILURE
} = createRequestActionTypes('GET_APPS');

export const fetchApps = () => {
  return (dispatch) => {
    dispatch({ type: GET_APPS_REQUEST });

    return api.fetchModels('apps')
      .then(apps => {
        dispatch({ type: GET_APPS_SUCCESS });
        return dispatch({
          type: SET_APPS,
          payload: apps
        });
      })
      .catch(error => dispatch({ type: GET_APPS_FAILURE, error: true, payload: error }));
  }
};


// # Reducer
const initialState = fromJS({
  apps: [],
  listState: false,
});

export default function apps(state = initialState, action) {
  switch (action.type) {
    case SET_APPS:
      return state.set('apps', fromJS(action.payload));
    case GET_APPS_REQUEST:
      return state.set('listState', LoadingStates.LOADING);
    case GET_APPS_SUCCESS:
      return state.set('listState', LoadingStates.READY);
    case GET_APPS_FAILURE:
      return state.set('listState', LoadingStates.FAILED);
    default: {
      return state;
    }
  }
}