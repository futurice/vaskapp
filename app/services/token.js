import { AsyncStorage } from 'react-native';
import STORAGE_KEYS from '../constants/StorageKeys';

export const getUserToken = (viewName) =>
  AsyncStorage.getItem(STORAGE_KEYS.token).then((token) => {
    const tokenObj = token ? JSON.parse(token) : {};
    return tokenObj.userToken;
  });
