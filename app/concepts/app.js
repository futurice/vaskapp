import { fetchApps } from './apps';
import { fetchActionTypes } from './competition';
import { fetchEvents } from '../actions/event';
import { fetchFeed } from '../actions/feed';
import { fetchTeams } from '../actions/team';
import { fetchUser } from '../concepts/registration';
import { fetchMarkers } from '../actions/marker';
// import { initializeUsersCitySelection } from './map';


// # Action types
const APP_CONTENT_LOADED = 'APP_CONTENT_LOADED';


// # Actions

// Load all content ig. after successful login
export const fetchAppContent = () => dispatch =>
  Promise.all([
    dispatch(fetchActionTypes()),
    dispatch(fetchUser()),
    dispatch(fetchFeed()),
    dispatch(fetchMarkers()),
    dispatch(fetchEvents()),
    dispatch(fetchTeams()),
    dispatch(fetchApps()),
  ])
  // .then(() => dispatch(initializeUsersCitySelection()))
  .then(() => dispatch({ type: APP_CONTENT_LOADED }));

