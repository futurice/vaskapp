import { fromJS, List } from 'immutable';

import { links } from '../constants/Links';


// # Selector
export const getProfileLinks = state => state.settings.get('links', List());

// # Action types
const SET_LINK = 'settings/SET_LINK';


// # Action creators
export const fetchLinks = () => {
  return (dispatch) => {
    dispatch({ type: SET_LINK, links });
  }
};


// # Reducer
const initialState = fromJS({
  links: []
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_LINK:
      return state.merge({
        links: fromJS(action.links)
      });

    default:
      return state;
  }
}
