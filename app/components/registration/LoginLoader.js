import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Platform,
  ActivityIndicator,
} from 'react-native';

import Loader from '../common/Loader';
import Text from '../common/MyText';
import theme from '../../style/theme';
import typography from '../../style/typography';
import LinearGradient from 'react-native-linear-gradient';

const IOS = Platform.OS === 'ios';

const LoginLoader = () => (
  <LinearGradient
    style={styles.container}
    locations={[0, 1]}
    start={{x: 0.35, y: 0}}
    end={{x: 1, y: 1}}
    colors={[theme.white, theme.white]}
  >
    <Loader size="large" color={theme.primary} />
  </LinearGradient>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoginLoader;
