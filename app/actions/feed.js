import api from '../services/api';
import {createRequestActionTypes} from '.';
import { getFeedSortType } from '../concepts/sortType';
import { getAllPostsInStore } from '../reducers/feed';
import { SET_COMMENTS as _SET_COMMENTS } from '../concepts/comments';

const SET_FEED = 'SET_FEED';
const APPEND_FEED = 'APPEND_FEED';
const SET_COMMENTS = _SET_COMMENTS;

const {
  GET_FEED_REQUEST,
  GET_FEED_SUCCESS,
  GET_FEED_FAILURE
} = createRequestActionTypes('GET_FEED');
const {
  REFRESH_FEED_REQUEST,
  REFRESH_FEED_SUCCESS,
  // Failure of refresh is also modeled as "success"
  // REFRESH_FEED_FAILURE
} = createRequestActionTypes('REFRESH_FEED');
const DELETE_FEED_ITEM = 'DELETE_FEED_ITEM';

const {
  VOTE_FEED_ITEM_REQUEST,
  VOTE_FEED_ITEM_SUCCESS,
} = createRequestActionTypes('VOTE_FEED_ITEM');

const fetchFeed = () => (dispatch, getState) => {
  const sort = getFeedSortType(getState());

  dispatch({ type: GET_FEED_REQUEST });
  return api.fetchModels('feed', { sort })
  .then(items => {
    dispatch({
      type: SET_FEED,
      feed: items
    });
    dispatch({ type: GET_FEED_SUCCESS });
  })
  .catch(error => dispatch({ type: GET_FEED_FAILURE, error: true, payload: error }));
};

const refreshFeed = () => (dispatch, getState) => {
  dispatch({ type: REFRESH_FEED_REQUEST });

  const sort = getFeedSortType(getState());
  return api.fetchModels('feed', { sort })
  .then(items => {
    dispatch({
      type: SET_FEED,
      feed: items
    });
    dispatch({ type: REFRESH_FEED_SUCCESS });
    dispatch({ type: GET_FEED_SUCCESS });
  })
  .catch(error => dispatch({ type: REFRESH_FEED_SUCCESS, error: true, payload: error }));
};

const loadMoreItems = (lastID) => (dispatch, getState) => {
  dispatch({ type: REFRESH_FEED_REQUEST });

  const sort = getFeedSortType(getState());
  return api.fetchMoreFeed(lastID, { sort })
  .then(items => {
    dispatch({
      type: APPEND_FEED,
      feed: items
    });
    dispatch({ type: REFRESH_FEED_SUCCESS });
    dispatch({ type: GET_FEED_SUCCESS });
  })
  .catch(error => dispatch({ type: REFRESH_FEED_SUCCESS }));
};

const removeFeedItem = (item) => {
  return dispatch => {
    api.deleteFeedItem(item)
      .then(() => dispatch({
        type: DELETE_FEED_ITEM,
        item
      }))
      .catch(error => console.log('Error when trying to delete feed item', error));
  };
};

const voteFeedItem = (feedItemId, value) => (dispatch, getState) => {
  const state = getState();
  const list = getAllPostsInStore(state);
  const voteItem = list.find((item) => item.get('id') === feedItemId);

  if (!voteItem) {
    return;
  }

  //  userVote needs to be updated
  //  votevalue for item need to be calculated
  //    * if user had no previous vote, just sum given vote to vote values
  //    * if user had voted before, vote changes total value by +/-2
  const votes = voteItem.get('votes');
  const userVote = voteItem.get('userVote');

  const wasAlreadyVotedByMe = userVote > 0;
  const difference = wasAlreadyVotedByMe ? -1 : 1;

  const newVotes = parseInt(votes) + difference;

  // Naive update before request starts
  dispatch({
    type: VOTE_FEED_ITEM_REQUEST,
    value,
    feedItemId,
    votes: newVotes
  });


  // Do actual API call for vote
  const vote = { value, feedItemId };
  api.voteFeedItem(vote)
  .then(() => dispatch({
    type: VOTE_FEED_ITEM_SUCCESS,
    difference,
    feedItemId
  }))
  .catch(error => console.log('Error when trying to vote feed item', error));
}


export {
  SET_FEED,
  APPEND_FEED,
  GET_FEED_REQUEST,
  GET_FEED_SUCCESS,
  VOTE_FEED_ITEM_REQUEST,
  VOTE_FEED_ITEM_SUCCESS,
  GET_FEED_FAILURE,
  REFRESH_FEED_REQUEST,
  REFRESH_FEED_SUCCESS,
  DELETE_FEED_ITEM,
  SET_COMMENTS,

  fetchFeed,
  refreshFeed,
  loadMoreItems,
  removeFeedItem,
  voteFeedItem,
};
