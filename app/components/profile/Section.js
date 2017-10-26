  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import React, { Component, PropTypes } from 'react';
import {
  View,
  Platform,
  StyleSheet,
} from 'react-native';
import { noop } from 'lodash'

import Text from '../common/MyText';
import theme from '../../style/theme';
import typography from '../../style/typography';

const IOS = Platform.OS === 'ios';


class Section extends Component {
  render() {
    const { title, key, children } = this.props;
    return (
      <View key={key} style={styles.section}>
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>{title}</Text>
        </View>
        {children}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  section: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.white,
    marginBottom: 20,
    paddingTop: 20,
    shadowColor: theme.secondaryDark,
    shadowOpacity: 0.06,
    shadowRadius: 7,
    shadowOffset: {
      height: 5,
      width: 0
    },
  },
  sectionTitle: {
    padding: 20,
    paddingVertical: 15,
    top: IOS ? 3 : 0,
  },
  sectionTitleText: typography.h1,
});

export default Section;
