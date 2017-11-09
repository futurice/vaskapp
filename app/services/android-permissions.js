import { PermissionsAndroid } from 'react-native';
import { get } from 'lodash';

async function requestLocationPermission(callback) {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Vask Location Permission',
        'message': 'Vask needs access to location ' +
                   'to serve best possible experience.'
      }
    )
    if (granted) {
      console.log("You can use the Location")
      callback();
    } else {
      console.log("Location permission denied")
    }
  } catch (err) {
    console.warn(err)
  }
}

async function requestCameraPermission(callback) {
  try {
    /*
    const grantCamera = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        'title': 'Vask Camera Permission',
        'message': 'Vask needs access to camera ' +
                   'to post images to feed.'
      }
    );

    const grantWrite = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        'title': 'Vask Storage Permission',
        'message': 'Vask needs access to storage ' +
        'to post images to feed.'
      }
    );
    */

    const grantCamera = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    ], {
      'title': 'Vask Camera Permission',
      'message': 'Vask needs access to camera and storage to post images to feed.'
    })/*.then((response) => {
      console.log('PERMISSIONS: ', response);
    });*/

    if (grantCamera) {
      console.log("You can use the Camera and storage")
      callback();
    } else {
      console.log("Camera permission denied")
    }
  } catch (err) {
    console.warn(err)
  }
}

export default {
  requestLocationPermission,
  requestCameraPermission
}
