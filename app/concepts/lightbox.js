'use strict';
import { fromJS, Map} from 'immutable';
import { createSelector } from 'reselect';
import { isNil } from 'lodash';

import { getAllPostsInStore } from '../reducers/feed';
import { getAllMapPostsInStore } from './map';


// # Action types
const OPEN_LIGHTBOX = 'lightbox/OPEN_LIGHTBOX';
const CLOSE_LIGHTBOX = 'lightbox/CLOSE_LIGHTBOX';


// # Selectors
export const isLightBoxOpen = state => state.lightbox.get('isLightBoxOpen', false);
export const getLightBoxItemId = state => state.lightbox.get('lightBoxItemId', null);

export const getLightboxItem = createSelector(
  getLightBoxItemId, getAllPostsInStore, getAllMapPostsInStore,
  (id, posts, mapPosts) => {

    if (isNil(id)) {
      return Map();
    }

    return posts.find((item) => item.get('id') === id) || mapPosts.find((item) => item.get('id') === id);
  }
);

// # Actions
export const openLightBox = (itemId) => ({ type: OPEN_LIGHTBOX, payload: itemId })
export const closeLightBox = () => ({ type: CLOSE_LIGHTBOX });



// # Reducer
const initialState = fromJS({
  lightBoxItem: {},
  lightBoxItemId: null,
  isLightBoxOpen: false
});

export default function lightbox(state = initialState, action) {
  switch (action.type) {
    case OPEN_LIGHTBOX:
      return state.merge({
        isLightBoxOpen: true,
        lightBoxItemId: action.payload
      });

    case CLOSE_LIGHTBOX:
      return state.merge({
        isLightBoxOpen: false,
        lightBoxItemId: null,
      })

    default:
      return state;
  }
}
