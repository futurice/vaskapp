/*
* Typography for Vask App
*/
import { Platform } from 'react-native';
import theme from './theme';

const IOS = Platform.OS === 'ios';

const h1 = {
  backgroundColor: 'transparent',
  fontSize: 22,
  lineHeight: IOS ? 26 : 33,
  fontWeight: 'normal',
  marginBottom: 5,
  color:theme.primary,
};

const h2 = {
  fontSize: 14,
  marginBottom: 25,
  fontWeight: 'normal',
  letterSpacing: 2,
  color: theme.dark,
}

const paragraph = {
  color: theme.midgrey,
  fontSize: 14,
  lineHeight: 23,
}

module.exports = {
  h1,
  h2,
  paragraph,
};
