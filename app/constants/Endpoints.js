import _ from 'lodash';
import * as ENV from '../../env';
const ROOT_URL = ENV.API_URL;

const EndpointUrls = {
  apps: `${ROOT_URL}/apps`,
  markers: `${ROOT_URL}/markers`,
  events: `${ROOT_URL}/events`,
  event: (eventId) => `${ROOT_URL}/events/${eventId}`,
  feed: `${ROOT_URL}/feed`,
  feedItem: (itemId) => `${ROOT_URL}/feed/${itemId}`,
  leaderboard: `${ROOT_URL}/leaderboard`,
  guilds: `${ROOT_URL}/guilds`,
  action: `${ROOT_URL}/actions`,
  user: (uuid) => `${ROOT_URL}/users/${uuid}`,
  teams: `${ROOT_URL}/teams`,
  actionTypes: `${ROOT_URL}/action_types`,
  announcements: `${ROOT_URL}/announcements`,
  vote: `${ROOT_URL}/vote`,
  cities: `${ROOT_URL}/cities`,
  radio: `${ROOT_URL}/radio`,
  mood: `${ROOT_URL}/mood`,
  conversations: `${ROOT_URL}/conversations`,
  conversationsCount: `${ROOT_URL}/conversations_count`,
  userProfile: (userId) => `${ROOT_URL}/users?userId=${userId}`,
  refreshToken: (token) => `${ROOT_URL}/auth/${token}`,
};

const EndpointTypes = _.map(EndpointUrls, (item, key) => key);

export default {
  urls: EndpointUrls,
  types: EndpointTypes
};
