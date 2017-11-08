/*
* Typography for Vask App
*/
import { Platform } from 'react-native';
import theme from './theme';

const IOS = Platform.OS === 'ios';

const h1 = {
  backgroundColor: 'transparent',
  fontSize: 21,
  lineHeight: IOS ? 25 : 32,
  fontWeight: 'normal',
  marginBottom: 5,
  color:theme.black,
};

const h2 = {
  fontSize: 14,
  lineHeight: 20,
  marginBottom: 25,
  fontWeight: 'normal',
  letterSpacing: 2,
  color: theme.primary,
}

const paragraph = {
  color: theme.midgrey,
  fontSize: 14,
  lineHeight: 20,
}

const extendStyle = style => extension => Object.assign({}, style, extension);

module.exports = {
  h1: extendStyle(h1),
  h2: extendStyle(h2),
  paragraph: extendStyle(paragraph),
};
