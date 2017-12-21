import { fetchApps } from './apps';
import { fetchActionTypes } from './competition';
import { fetchEvents } from '../actions/event';
import { fetchFeed } from '../actions/feed';
import { fetchTeams } from '../actions/team';
import { fetchUser } from '../concepts/registration';
import { fetchUnreadConversationCount } from '../concepts/conversations';
import { fetchMarkers } from '../actions/marker';

// # Action types
const APP_CONTENT_LOADED = 'APP_CONTENT_LOADED';

// # Actions
// Load all content after successful login
export const fetchAppContent = () => dispatch =>
  Promise.all([
    dispatch(fetchActionTypes()),
    dispatch(fetchUser()),
    dispatch(fetchFeed()),
    dispatch(fetchMarkers()),
    // dispatch(fetchEvents()),
    dispatch(fetchTeams()),
    dispatch(fetchApps()),
    dispatch(fetchUnreadConversationCount()),
  ])
  .then(() => dispatch({ type: APP_CONTENT_LOADED }));

