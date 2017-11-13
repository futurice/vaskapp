import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Dimensions,
} from 'react-native';
import { Map } from 'immutable';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Text from '../common/MyText';
import AnimateMe from '../AnimateMe';

import theme from '../../style/theme';
import typography from '../../style/typography';

const { width } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

const EmptyState = () => {
  return (
    <View style={styles.container}>
      <AnimateMe delay={300} animationType={'fade-from-bottom'}>
        <View style={styles.circle}>
          <AnimateMe delay={600} animationType={'drop-in'}>
            <Icon
              style={styles.feedIcon}
              name={'looks'}
            />
          </AnimateMe>
        </View>
      </AnimateMe>
      <Text style={styles.title}>Get the feed flowing</Text>
      <Text style={styles.explanation}>You have good chances to be the first one to post!</Text>
    </View>
  )
};



const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    top: -50,
  },
  circle: {
    backgroundColor: theme.secondarySubtle,
    width: width / 2,
    height: width / 2,
    borderRadius: width / 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedIcon: {
    color: theme.white,
    fontSize: width / 3,
    backgroundColor: 'transparent',
    top: -20,
  },
  title: {
    marginTop: 20,
    color: theme.grey4,
    fontSize: 20,
    textAlign: 'center',
  },
  explanation: {
    textAlign: 'center',
    color: theme.grey4,
    marginTop: 10,
    paddingHorizontal: 20,
  }
});

export default EmptyState;