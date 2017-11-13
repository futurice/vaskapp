// # concepts/map
// This is so called 'view concept'
// that combines core concepts like 'marker' and 'event'
import { AsyncStorage } from 'react-native';
import { createSelector, createStructuredSelector } from 'reselect';
import { fromJS, List, Map } from 'immutable';
import { keyBy, map } from 'lodash';
import moment from 'moment';
import { createRequestActionTypes } from '../actions';

import SortTypes from '../constants/SortTypes';
import { getCurrentCityName } from './city';
import {
  updateShowFilter as _updateShowFilter,
  toggleLocateMe as _toggleLocateMe
} from '../actions/event';
import { fetchMarkers as _fetchMarkers } from '../actions/marker';
import { trackEvent } from '../services/analytics';

import { SET_COMMENTS } from './comments';
import { isLocating, getShowFilter, getEvents, getEventListState } from '../reducers/event';
import * as m from '../reducers/marker';
import api from '../services/api';
import LoadingStates from '../constants/LoadingStates';
import MarkerImages from '../constants/MarkerImages';
import time from '../utils/time';
import { HELSINKI, CITY_CATEGORIES, CITY_MAX_DISTANCE } from '../constants/Cities';
import StorageKeys from '../constants/StorageKeys';

// # Constants
// radius how far from center (office) data should be fetched
const MAP_QUERY_RADIUS = 20 * 1000; // meters
const MAP_QUERY_LIMIT = 10;
const ALL_QUERY_LIMIT = 20;
const ALL_CATEGORY = 'ALL';

// # Action types
const SET_POSTS = 'SET_POSTS';
const APPEND_POSTS = 'APPEND_POSTS';
const {
  GET_POSTS_REQUEST,
  GET_POSTS_SUCCESS,
  GET_POSTS_FAILURE
} = createRequestActionTypes('GET_POSTS');


// # Selectors
const getSelectedCategory = state => state.usermap.get('selectedCategory');
const getSelectedMarkerId = state => state.usermap.get('selectedMarkerId');
const getSelectedMarkerType = state => state.usermap.get('selectedMarkerType');
const getMapPostsState = state => state.usermap.get('loadingPosts');
export const getAllMapPostsInStore = state => state.usermap.get('posts') || List();

const isMapLoading = createSelector(
  m.getMarkerListState, getEventListState, getMapPostsState, (a, b, c) =>
  a === LoadingStates.LOADING || b === LoadingStates.LOADING || c === LoadingStates.LOADING
);

const isEventBetweenSelectedTime = (event, firstFutureEvent, showFilter) => {
  switch (showFilter) {
    case '24H':
    return firstFutureEvent &&
      firstFutureEvent.get('endTime') &&
      time.eventsBetweenHours(event.get('endTime'), firstFutureEvent.get('endTime'), 24);
    default:
      return true;
  }
}


const getMarkers = createSelector(
  m.getMarkers, getAllMapPostsInStore, getSelectedCategory,
  (markers, posts, selectedCategory) => {
    const postMarkers = posts.filter(post => post.has('location'));

    // categoryMarkers === "cities"
    const categoryMarkers = selectedCategory && selectedCategory !== ALL_CATEGORY
      ? markers.filter(m => m.get('type') === selectedCategory)
      : markers;

    return categoryMarkers.concat(postMarkers);
  }
)

// const postMarkerCategories = ['IMAGE', 'TEXT'];

const getMapMarkers = createSelector(
  getMarkers, (markers) => markers.filter(marker => marker.has('location')));

const getMapMarkersCoords = createSelector(getMapMarkers, markers => {
  return markers.map(marker => marker.get('location')).toJS();
});


// Categories from markers got from marker endpoint only
// Hence cities
const getMarkerCategories = createSelector(
  m.getMarkers, (markers) => {
    const validMarkers = markers
      .filter(marker => marker.has('location'))
      .map(marker => marker.get('type', '').toUpperCase())
      .toSet().toList(); // Immutable uniq

    // return validMarkers;
    return validMarkers.push(ALL_CATEGORY);
  }
);

// (City) Markers Keyed by city
const getMarkerLocations = createSelector(
  m.getMarkers, (markers) => {
    const markersKeyByType = keyBy(markers.toJS(), 'type');

    return fromJS(markersKeyByType);
  }
);

const getSelectedMarker = createSelector(
  getSelectedMarkerId,
  getSelectedMarkerType,
  getAllMapPostsInStore,
  m.getMarkers,
  getMarkerCategories,
  (id, type, posts, markers, categories) => {
    const isCategoryMarkerSelected = categories.indexOf(type) >= 0;
    const markerHayStack = isCategoryMarkerSelected ? markers : posts;

    return markerHayStack.find(post => post.get('id') === id);
  });


// View concept selector
export const mapViewData = createStructuredSelector({
  currentCity: getCurrentCityName,
  locateMe: isLocating,
  showFilter: getShowFilter,
  markers: getMarkers,
  loading: isMapLoading,
  mapMarkers: getMapMarkers,
  selectedMarker: getSelectedMarker,
  selectedCategory: getSelectedCategory,
  categories: getMarkerCategories,
  markerLocations: getMarkerLocations,
  visiblemarkerCoords: getMapMarkersCoords,
})

// # Action types & creators
const SELECT_MARKER = 'map/SELECT_MARKER';
const SELECT_CATEGORY = 'map/SELECT_CATEGORY';

export const fetchMarkers = _fetchMarkers;
export const updateShowFilter = _updateShowFilter;
export const toggleLocateMe = _toggleLocateMe;

export const selectMarker = (markerId, markerType) => ({ type: SELECT_MARKER, markerId, markerType });

export const selectCategory = payload => (dispatch) => {
  trackEvent('map', 'select-city', payload);

  // Not saving *ALL*-selection as default
  // since fetching data on start is not working
  if (payload !== ALL_CATEGORY) {
    AsyncStorage.setItem(StorageKeys.mapCategory, payload);
  }

  return Promise.resolve(dispatch({ type: SELECT_CATEGORY, payload }))
    .then(() => dispatch(fetchPostsForCity()));
};


export const initializeUsersCitySelection = () => (dispatch, getState) =>
  AsyncStorage.getItem(StorageKeys.mapCategory)
    .then(city => {
      if (city) {
        return dispatch(selectCategory(city))
      }
      return Promise.resolve();
    })
    .catch(error => { console.log('error when initializing map category') });


export const fetchPostsForCity = () => (dispatch, getState) => {
  const state = getState();

  // We are using 'markers' as 'city'
  // in current data model
  const cities = m.getMarkers(state);
  const cityId = getSelectedCategory(state);

  const selectedCity = cities.find(city => city.get('type', '').toUpperCase() === cityId);

  let queryParams = {};
  // request ALL_CATEGORY
  if (!selectedCity || !selectedCity.has('location')) {
    queryParams = { limit: ALL_QUERY_LIMIT };
  } else {
    const cityLocation = selectedCity.get('location').toJS(); // center for geo-querying posts
    queryParams = { radius: MAP_QUERY_RADIUS, ...cityLocation, limit: MAP_QUERY_LIMIT };
  }

  const sort = SortTypes.SORT_NEW; // sort choronologically
  const since = moment().subtract(1, 'week').toISOString(); // week ago

  const mapQueryParams = { sort, ...queryParams, since }

  dispatch({ type: GET_POSTS_REQUEST });

  return api.fetchModels('feed', mapQueryParams)
  .then(items => {
    dispatch({ type: GET_POSTS_SUCCESS });
    return dispatch({
      type: SET_POSTS,
      payload: items
    });
  })
  .catch(error => dispatch({ type: GET_POSTS_FAILURE, error: true, payload: error }));
};


// # Reducer
const initialState = fromJS({
  selectedCategory: HELSINKI,
  selectedMarkerId: null,
  selectedMarkerType: null,
  posts: [],
  loadingPosts: false,
});

export default function usermap(state = initialState, action) {
  switch (action.type) {
    case SELECT_MARKER: {
      return state.merge({
        selectedMarkerId: action.markerId,
        selectedMarkerType: action.markerType,
      });
    }

    case SELECT_CATEGORY: {
      return state.merge({
        selectedCategory: action.payload,
        selectedMarkerId: null,
        selectedMarkerType: null,
      });
    }

    case SET_POSTS:
      return state.set('posts', fromJS(action.payload));

    case GET_POSTS_REQUEST:
      return state.set('loadingPosts', LoadingStates.LOADING);

    case GET_POSTS_SUCCESS:
      return state.set('loadingPosts', LoadingStates.READY);

    case GET_POSTS_FAILURE:
      return state.set('loadingPosts', LoadingStates.FAILED);

    case SET_COMMENTS: {
      const list = state.get('posts');
      const itemIndex = list.findIndex((item) => item.get('id') === action.payload.postId);

      if (itemIndex < 0) {
        console.log('Tried to update comment count for map post, but it was not found from state:', itemIndex);
        return state;
      } else {
        console.log('updating comment count for map post', itemIndex);
        return state.setIn(['posts', itemIndex, 'commentCount'], action.payload.comments.length || 0);
      }
    }

    default: {
      return state;
    }
  }
}

