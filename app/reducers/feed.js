'use strict';
import { fromJS, List } from 'immutable';
import { isNil } from 'lodash';

import {
  SET_FEED,
  APPEND_FEED,
  GET_FEED_REQUEST,
  GET_FEED_SUCCESS,
  GET_FEED_FAILURE,
  REFRESH_FEED_REQUEST,
  REFRESH_FEED_SUCCESS,
  DELETE_FEED_ITEM,
  VOTE_FEED_ITEM_REQUEST,
  SET_COMMENTS
} from '../actions/feed';
import LoadingStates from '../constants/LoadingStates';

// # Selectors
export const getFeed = state => state.feed.get('list') || List([]);
export const getAllPostsInStore = getFeed;


// # Reducer
const initialState = fromJS({
  list: [],
  listState: LoadingStates.NONE,
  isRefreshing: false,
});

export default function feed(state = initialState, action) {
  switch (action.type) {
    case SET_FEED:
      return state.set('list', fromJS(action.feed));
    case APPEND_FEED:
      return (action.feed && action.feed.length) ?
        state.set('list', fromJS(state.get('list')
          .concat(fromJS(action.feed)))) :
        state;
    case GET_FEED_REQUEST:
      return state.set('listState', LoadingStates.LOADING);
    case GET_FEED_SUCCESS:
      return state.set('listState', LoadingStates.READY);
    case GET_FEED_FAILURE:
      return state.set('listState', LoadingStates.FAILED);
    case REFRESH_FEED_REQUEST:
      return state.set('isRefreshing', true);
    case REFRESH_FEED_SUCCESS:
      return state.set('isRefreshing', false);
    case DELETE_FEED_ITEM:
      const originalList = state.get('list');
      const itemIndex = originalList.findIndex((item) => item.get('id') === action.item.id);

      if (itemIndex < 0) {
        console.log('Tried to delete item, but it was not found from state:', itemIndex);
        return state;
      } else {
        return state.set('list', originalList.delete(itemIndex));
      }

    case VOTE_FEED_ITEM_REQUEST: {
      const list = state.get('list');
      const voteItemIndex = list.findIndex((item) => item.get('id') === action.feedItemId);
      if (voteItemIndex < 0) {
        console.log('Tried to vote item, but it was not found from state:', voteItemIndex);
        return state;
      } else {
        return state.mergeIn(['list', voteItemIndex], {
          userVote: action.value,
          votes: action.votes
        });
      }
    }

    case SET_COMMENTS: {
      const list = state.get('list');
      const itemIndex = list.findIndex((item) => item.get('id') === action.payload.postId);

      if (itemIndex < 0) {
        console.log('Tried to update comment count for feed post, but it was not found from state:', itemIndex);
        return state;
      } else {
        console.log('updating comment count for feed post');
        return state.setIn(['list', itemIndex, 'commentCount'], action.payload.comments.length || 0);
      }
    }

    default:
      return state;
  }
}
