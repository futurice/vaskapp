import { APP_STORAGE_KEY } from '../../env';

const ROOT_KEY = APP_STORAGE_KEY;

const tokenKeys = {
  token: `${ROOT_KEY}:token`,
  city: `${ROOT_KEY}:city`,
  mapCategory: `${ROOT_KEY}:mapCategory`,
  loginInProgress: `${ROOT_KEY}:loginInProgress`,
  conversationsLastChecked: `${ROOT_KEY}:conversationsLastChecked`,
}

export default tokenKeys;
