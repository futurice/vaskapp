import { Platform } from 'react-native';
import { fromJS } from 'immutable';
import { get } from 'lodash';
import permissions from '../services/android-permissions';

const IOS = Platform.OS === 'ios';
let watchID;

//
// Constants
//
const locationOpts = {
	enableHighAccuracy: false,
  timeout: 20000, // 20 sec
  maximumAge: 1000 * 60 * 5 // 5 min
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
        () => reject()
      );
    });
  }
}

export const getLocationFromDevice = () => (dispatch) => {
  var locationPromise = new Promise(function(resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      position => resolve(dispatch(updateLocation(position))),
      error => reject(error.message),
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

