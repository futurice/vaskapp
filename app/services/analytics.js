import { Platform } from 'react-native';
import {
  Analytics,
  Hits as GAHits
} from 'react-native-google-analytics';
import DeviceInfo from 'react-native-device-info';
import {version as VERSION_NUMBER} from '../../package.json';

const GA_TRACKING_ID = 'UA-109240256-1';
const APP_NAME = 'Vask';
const CLIENT_ID = DeviceInfo.getUniqueID();
const INSTALLER_ID = 'futu.vask.' + Platform.OS;

var ga = new Analytics(GA_TRACKING_ID, CLIENT_ID, 1, DeviceInfo.getUserAgent());

export function viewOpened(viewName) {
  var screenView = new GAHits.ScreenView(APP_NAME, viewName, VERSION_NUMBER, INSTALLER_ID);
  ga.send(screenView);
}

export function trackEvent(category, action, label, value) {
  var gaEvent = new GAHits.Event(category, action, label, value);
  ga.send(gaEvent);
}

export default {
  viewOpened,
  trackEvent,
}
