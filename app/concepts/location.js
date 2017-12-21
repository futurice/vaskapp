import { Platform } from 'react-native';
import { fromJS } from 'immutable';
import { get } from 'lodash';
import permissions from '../services/android-permissions';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';

const IOS = Platform.OS === 'ios';
let watchID;

//
// Constants
//
const locationOpts = {
	enableHighAccuracy: !IOS,
  timeout: 20000, // 20 sec
  maximumAge: 1000 * 5 // 5 sec
};


//
// Selectors
//
export const getLocation = state => state.location.get('currentLocation');

//
// Action types
//
export const UPDATE_LOCATION = 'UPDATE_LOCATION';


//
// Reducer
//
const initialState = fromJS({
  currentLocation: null
});

export default function location(state = initialState, action) {
  switch (action.type) {
    case UPDATE_LOCATION:
      return state.set('currentLocation', action.payload);
    default:
      return state;
  }
};



//
// Action creators
//

export const updateLocation = (position) => ({
	type: UPDATE_LOCATION,
	payload: {
		latitude: get(position, 'coords.latitude'),
		longitude: get(position, 'coords.longitude'),
	}
});



// # Get location once
export const fetchUserLocation = () => (dispatch) => {
  if (IOS) {
    return dispatch(getLocationFromDevice());
  } else {
    // Check that this works on Android
    return new Promise(function(resolve, reject) {
      permissions.requestLocationPermission(
        () => resolve(dispatch(getLocationFromDevice())),
        () => resolve()
      );
    });
  }
}



export const getLocationFromDevice = () => (dispatch) => {
  if (IOS) {
    return dispatch(getCurrentPosition());
  }

  return LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message: '<h3>Vask needs your location</h3>App needs to enable your location.',
      ok: 'Enable Location',
      cancel: 'No thanks',
      enableHighAccuracy: true,
      showDialog: true, // false => Opens the Location access page directly
      openLocationServices: true // false => Directly catch method is called if location services are turned off
  }).then(function(success) {
      console.log(success); // success => {alreadyEnabled: false, enabled: true, status: 'enabled'}
      return dispatch(getCurrentPosition());
  }).catch((error) => {
      console.log(error.message); // error.message => 'disabled'

      // just resolve dummy promise, no location :(
      return dispatch(Promie.resolve());
  });
}

const getCurrentPosition = () => (dispatch) => {
  var locationPromise = new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      position => console.log('got location') || resolve(dispatch(updateLocation(position))),
      error => console.log('did not get location', error) || resolve(error.message),
      locationOpts
    );
  });

  return locationPromise;
}

// # Location Watcher
export const startLocationWatcher = () => (dispatch) => {
  if (IOS) {
    dispatch(initLocationWatcher());
  } else {
    // This does not work
    permissions.requestLocationPermission(initLocationWatcher);
  }
}


// Not used ATM
export const initLocationWatcher = () => (dispatch) => {
	navigator.geolocation.getCurrentPosition(
		position => dispatch(updateLocation(position)),
		error => console.log(error.message),
		locationOpts
	);

	watchID = navigator.geolocation.watchPosition(
		position => dispatch(updateLocation(position)),
		error => console.log(error.message),
		locationOpts
	);
}

export const stopLocationWatcher = () => (dispatch) => {
  if (watchID) {
    navigator.geolocation.clearWatch(watchID);
  }
}

