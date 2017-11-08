import { Dimensions, Platform } from 'react-native';
import { isIphoneX as _isIphoneX } from 'react-native-iphone-x-helper';

const { height, width } = Dimensions.get('window');

// IOS or Anrdoid
export const IOS = Platform.OS === 'ios';


// Ipad
const aspectRatio = height/width;
export const isIpad = aspectRatio <= 1.6;

// Iphone X
export const isIphoneX = _isIphoneX();




