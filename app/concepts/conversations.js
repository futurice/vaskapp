import { AsyncStorage } from 'react-native';
import { createSelector, createStructuredSelector } from 'reselect';
import { fromJS, List, Map } from 'immutable';
import moment from 'moment';

import api from '../services/api';
import { createRequestActionTypes } from '../actions';
import StorageKeys from '../constants/StorageKeys';

// # Selectors
export const getConversations = state => state.conversations.get('conversations', List([]));
export const getUnreadConversationCount = state => state.conversations.get('unreadConversations', 0);
export const getLastConversationsCheckTime = state => state.conversations.get('lastConversationCheck', null);
export const getPrevConversationsCheckTime = state => state.conversations.get('prevConversationCheck', null);
export const isLoading = state => state.conversations.get('isLoading', false);

export const getSortedConversations = createSelector(
  getConversations, getPrevConversationsCheckTime, (conversations, prevCheckTime) => {
    return conversations
      .sortBy(c => c.getIn(['comment', 'createdAt']))
      .map(c => c.set('new', !!prevCheckTime && prevCheckTime < c.getIn(['comment', 'createdAt'])))
      .reverse()
      .groupBy(x => x.get('id'))
      .map(x => x.first())
      .toList()
  })

export const getConversationsData = createStructuredSelector({
  conversations: getSortedConversations,
  isLoading,
});

// # Action types & creators
const {
  GET_CONVERSATIONS_REQUEST,
  GET_CONVERSATIONS_SUCCESS,
  GET_CONVERSATIONS_FAILURE
} = createRequestActionTypes('GET_CONVERSATIONS');

export const SET_CONVERSATIONS = 'conversations/SET_CONVERSATIONS';

export const fetchConversations = () => (dispatch) => {
  dispatch({ type: GET_CONVERSATIONS_REQUEST });
  return api.fetchModels('conversations')
    .then((conversations) => {
      dispatch({
        type: SET_CONVERSATIONS,
        payload: { conversations }
      });
      dispatch({ type: GET_CONVERSATIONS_SUCCESS });

      // Update check time and set unread conversations to 0
      dispatch(updateCheckTimeInStorage());
      dispatch({ type: SET_UNREAD_CONVERSATION_COUNT, payload: 0 });
    })
    .catch(error => dispatch({ type: GET_CONVERSATIONS_FAILURE, error: true, payload: error }));
}


// Get unread conversations count
const SET_UNREAD_CONVERSATION_COUNT = 'conversations/SET_UNREAD_CONVERSATION_COUNT'

export const fetchUnreadConversationCount = () => (dispatch, getState) => {
  const params = {};

  AsyncStorage.getItem(StorageKeys.conversationsLastChecked)
  .then(lastCheck => {
    let since = lastCheck || moment().toISOString();

    params.since = since;
    dispatch(storePreviousCheckTime(since));

    dispatch(updateCheckTime());

    return api.fetchModels('conversationsCount', params)
    .then((count) => dispatch({
      type: SET_UNREAD_CONVERSATION_COUNT,
      payload: count
    }));
  });
}

const UPDATE_CONVERSATION_CHECK_TIME = 'conversations/UPDATE_CONVERSATION_CHECK_TIME';
const UPDATE_PREV_CONVERSATION_CHECK_TIME = 'conversations/UPDATE_PREV_CONVERSATION_CHECK_TIME';
const updateCheckTimeInStorage = () => dispatch => {
  const now = moment().toISOString();

  // update storage
  return AsyncStorage.setItem(StorageKeys.conversationsLastChecked, now);
}

const updateCheckTime = () => dispatch => {
  const now = moment().toISOString();
  // update store
  return dispatch({ type: UPDATE_CONVERSATION_CHECK_TIME, payload: now });
}

const storePreviousCheckTime = (time) => ({ type: UPDATE_PREV_CONVERSATION_CHECK_TIME, payload: time });



// # Reducer
const initialState = fromJS({
  conversations: [],
  unreadConversations: 0,
  lastConversationCheck: null,
  prevConversationCheck: null,
  isLoading: false,
});

export default function conversations(state = initialState, action) {
  switch (action.type) {
    case SET_CONVERSATIONS: {
      return state.set('conversations', fromJS(action.payload.conversations));
    }

    case GET_CONVERSATIONS_REQUEST:
      return state.set('isLoading', true);

    case GET_CONVERSATIONS_SUCCESS:
    case GET_CONVERSATIONS_FAILURE: {
      return state.set('isLoading', false);
    }

    case SET_UNREAD_CONVERSATION_COUNT:
      return state.set('unreadConversations', action.payload);

    case UPDATE_CONVERSATION_CHECK_TIME:
      return state.set('lastConversationCheck', action.payload);

    case UPDATE_PREV_CONVERSATION_CHECK_TIME:
      return state.set('prevConversationCheck', action.payload);

    default: {
      return state;
    }
  }
}
