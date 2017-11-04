import { createSelector, createStructuredSelector } from 'reselect';
import { fromJS, List, Map } from 'immutable';

import api from '../services/api';
import { createRequestActionTypes } from '../actions';

// # Selectors
export const getConversations = state => state.conversations.get('conversations', List([]));
export const isLoading = state => state.conversations.get('isLoading', false);

export const getSortedConversations = createSelector(
  getConversations, conversations => {
    return conversations
      .sortBy(c => c.get('commentCreatedAt'))
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
    })
    .catch(error => dispatch({ type: GET_CONVERSATIONS_FAILURE, error: true, payload: error }));
}



// # Reducer
const initialState = fromJS({
  conversations: [],
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

    default: {
      return state;
    }
  }
}
