import { Dimensions, Platform } from 'react-native';
const { height, width } = Dimensions.get('window');

// IOS or Anrdoid
export const IOS = Platform.OS === 'ios';


// Ipad
const aspectRatio = height/width;
export const isIpad = aspectRatio <= 1.6;




