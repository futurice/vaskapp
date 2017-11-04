import React from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Dimensions,
} from 'react-native';
import { Map } from 'immutable';

import Icon from 'react-native-vector-icons/Ionicons';
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
                style={styles.commentIcon}
                name={'md-chatbubbles'}
            />
          </AnimateMe>
        </View>
      </AnimateMe>
      <Text style={styles.title}>No comments yet</Text>
      <Text style={styles.explanation}>Here you will find conversations where you have commented.</Text>
    </View>
  )
};



const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: width / 4,
  },
  circle: {
    backgroundColor: theme.secondarySubtle,
    width: width / 2,
    height: width / 2,
    borderRadius: width / 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentIcon: {
    color: theme.white,
    fontSize: width / 4,
    backgroundColor: 'transparent',
    top: 10,
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