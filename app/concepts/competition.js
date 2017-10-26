import { fromJS, List } from 'immutable';
import { createSelector } from 'reselect';
import { isNil } from 'lodash';
import api from '../services/api';
import ActionTypes from '../constants/ActionTypes';
import * as NotificationMessages from '../utils/notificationMessage';
import { refreshFeed } from '../actions/feed';
import { sortFeedChronological } from '../concepts/sortType';
import { getCityId } from '../concepts/city';
import { createRequestActionTypes } from '../actions';

// # Selectors
export const getActionTypes = state => state.competition.get('actionTypes',  List());

const selectableActionTypes = [ActionTypes.IMAGE, ActionTypes.TEXT];
export const getActionTypesForFeed = createSelector(
  getActionTypes,
  (types) => {
    let feedActionTypes = types.filter((type) => selectableActionTypes.indexOf(type.get('code')) >= 0);

    // Add 'pick from library'
    let additionalImageFeedType = types.find(type => type.get('code') === ActionTypes.IMAGE);
    if (additionalImageFeedType) {
      additionalImageFeedType = additionalImageFeedType.merge({
        subType: 'library',
        name: 'Upload'
      });
      feedActionTypes = feedActionTypes.unshift(additionalImageFeedType);
    }

    return feedActionTypes.reverse();
  }
);

// # Action Types
export const {
  POST_ACTION_REQUEST,
  POST_ACTION_SUCCESS,
  POST_ACTION_FAILURE
} = createRequestActionTypes('POST_ACTION');
export const {
  GET_ACTION_TYPES_REQUEST,
  GET_ACTION_TYPES_SUCCESS,
  GET_ACTION_TYPES_FAILURE
} = createRequestActionTypes('GET_ACTION_TYPES');

export const OPEN_TEXTACTION_VIEW = 'OPEN_TEXTACTION_VIEW';
export const CLOSE_TEXTACTION_VIEW = 'CLOSE_TEXTACTION_VIEW';
export const OPEN_CHECKIN_VIEW = 'OPEN_CHECKIN_VIEW';
export const CLOSE_CHECKIN_VIEW = 'CLOSE_CHECKIN_VIEW';
export const SHOW_NOTIFICATION = 'SHOW_NOTIFICATION';
export const HIDE_NOTIFICATION = 'HIDE_NOTIFICATION';
export const UPDATE_COOLDOWNS = 'UPDATE_COOLDOWNS';
export const SET_EDITABLE_IMAGE = 'SET_EDITABLE_IMAGE';
export const CLEAR_EDITABLE_IMAGE = 'CLEAR_EDITABLE_IMAGE';


// # Action Creators
const openTextActionView = () => ({ type: OPEN_TEXTACTION_VIEW });

const closeTextActionView = () => ({ type: CLOSE_TEXTACTION_VIEW });

const openCheckInView = () => ({ type: OPEN_CHECKIN_VIEW });

const closeCheckInView = () => ({ type: CLOSE_CHECKIN_VIEW });

const _postAction = (payload, addLocation) => {
  return (dispatch, getState) => {
    dispatch({ type: POST_ACTION_REQUEST });

    const state = getState();
    const maybeLocationToPost = addLocation ? state.location.get('currentLocation') : null;

    return api.postAction(payload, maybeLocationToPost)
      .then(response => {
        // Set feed sort to 'new' if posted image or text, otherwise just refresh
        if ([ActionTypes.TEXT, ActionTypes.IMAGE].indexOf(payload.type) >= 0) {
          dispatch(sortFeedChronological())
        } else {
          dispatch(refreshFeed());
        }

        dispatch({ type: POST_ACTION_SUCCESS, payload: { type: payload.type } });
        dispatch({ type: SHOW_NOTIFICATION, payload: NotificationMessages.getMessage(payload) });


        setTimeout(() => {
          dispatch({ type: HIDE_NOTIFICATION });
        }, 3000);
      })
      .catch(e => {
        console.log('Error catched on competition action post!', e);

        if (e.response.status === 429) {
          dispatch({
            type: SHOW_NOTIFICATION,
            payload: NotificationMessages.getRateLimitMessage(payload)
          });
        } else if (e.response.status === 403) {
          dispatch({
            type: SHOW_NOTIFICATION,
            payload: NotificationMessages.getInvalidEventMessage(payload)
          });
        } else {
          dispatch({
            type: SHOW_NOTIFICATION,
            payload: NotificationMessages.getErrorMessage(payload)
          });
        }
        dispatch({ type: POST_ACTION_FAILURE, error: e });

        setTimeout(() => {
          dispatch({ type: HIDE_NOTIFICATION });
        }, 3000);
      });
  };
};

export const postAction = type => {
  return _postAction({
    type
  });
};

export const postText = text => (dispatch) =>
  Promise.resolve(
    dispatch(_postAction({
      type: ActionTypes.TEXT,
      text: text
    }))
  )
  .then(() => {
    setTimeout(() => {
      dispatch(closeTextActionView())
    }, 2000);
  });

export const postImage = ({ image, text, imageText, imageTextPosition, addLocation }) => {
  const postObject = Object.assign({
    type: ActionTypes.IMAGE,
    imageData: image,
  },
  !!text ? { text } : {},
  !!imageText ? { imageText, imageTextPosition } : {});

  return _postAction(postObject, addLocation);
};

export const checkIn = eventId => {
  return _postAction({
    type: ActionTypes.CHECK_IN_EVENT,
    eventId: eventId
  });
}

export const fetchActionTypes = () => {
  return dispatch => {
    dispatch({ type: GET_ACTION_TYPES_REQUEST });
    api.fetchModels('actionTypes')
      .then(actionTypes => dispatch({ type: GET_ACTION_TYPES_SUCCESS, payload: actionTypes }))
      .catch(e => dispatch({ type: GET_ACTION_TYPES_FAILURE, error: true, payload: e }));
  };
};

export const updateCooldowns = () => {
  return { type: UPDATE_COOLDOWNS };
};

export const setEditableImage = (editableImage) => ({ type: SET_EDITABLE_IMAGE, payload: editableImage });
export const clearEditableImage = () => ({ type: CLEAR_EDITABLE_IMAGE });

// # Reducer
const initialState = fromJS({
  isSending: false,
  isError: false,
  isLoadingActionTypes: false,
  isErrorLoadingActionTypes: false,
  actionTypes: [],
  disabledActionTypes: [],
  cooldownTimes: {},
  isTextActionViewOpen: false,
  isCheckInViewOpen: false,
  isNotificationVisible: false,
  notificationText: '',
  editableImage: null,
});

const getDisabledActions = (state) => {
  // Called once a second from FeedList (UPDATE_COOLDOWNS action)
  // - go through all cooldownTimes
  // - compare them to current time
  // - if actionType has cooldownTime and cooldownTime > now, add actionType to disabledActionTypes list

  const now = new Date().getTime();
  return state
    .get('actionTypes')
    .map(at => at.get('code'))
    .reduce((acc, curr) => {
      const cooldownEnd = state.getIn(['cooldownTimes', curr]);
      const isActionCoolingDown = cooldownEnd && cooldownEnd > now;
      if (isActionCoolingDown) {
        return acc.push(curr);
      }

      return acc;
    }, List());
};

export default function competition(state = initialState, action) {
  switch (action.type) {
    case OPEN_TEXTACTION_VIEW:
      return state.set('isTextActionViewOpen', true);
    case CLOSE_TEXTACTION_VIEW:
      return state.set('isTextActionViewOpen', false);
    case OPEN_CHECKIN_VIEW:
      return state.set('isCheckInViewOpen', true);
    case CLOSE_CHECKIN_VIEW:
      return state.set('isCheckInViewOpen', false);
    case POST_ACTION_REQUEST:
      return state.merge({
        isSending: true,
        isError: false
      });
    case POST_ACTION_SUCCESS:
      const actionType = state
        .get('actionTypes')
        .find(at => at.get('code') === action.payload.type);
      const actionCooldownTime = actionType ? actionType.get('cooldown') : 0;
      const availableNextTime = new Date().getTime() + actionCooldownTime;
      return state
        .merge({ isSending: false, isError: false })
        .update('cooldownTimes', times => times.set(action.payload.type, availableNextTime));
    case POST_ACTION_FAILURE:
      return state.merge({
        isSending: false,
        isError: true
      });
    case GET_ACTION_TYPES_REQUEST:
      return state.merge({
        isLoadingActionTypes: true,
        isErrorLoadingActionTypes: false
      });
    case GET_ACTION_TYPES_SUCCESS:
      return state.merge({
        isLoadingActionTypes: false,
        isErrorLoadingActionTypes: false,
        actionTypes: action.payload
      });
    case GET_ACTION_TYPES_FAILURE:
      return state.merge({
        isLoadingActionTypes: false,
        isErrorLoadingActionTypes: true
      });
    case SHOW_NOTIFICATION:
      return state.merge({
        isNotificationVisible: true,
        notificationText: action.payload
      });
    case HIDE_NOTIFICATION:
      return state.merge({
        isNotificationVisible: false,
        notificationText: ''
      });
    case UPDATE_COOLDOWNS:
      return state.set('disabledActionTypes', getDisabledActions(state));
    case SET_EDITABLE_IMAGE:
      return state.set('editableImage', action.payload);
    case CLEAR_EDITABLE_IMAGE:
      return state.set('editableImage', null);
    default:
      return state;
  }
}