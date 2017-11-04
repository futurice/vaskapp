  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import React, { Component, PropTypes } from 'react';
import {
  View,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { noop } from 'lodash'

import Text from '../common/MyText';
import theme from '../../style/theme';
import typography from '../../style/typography';

const IOS = Platform.OS === 'ios';

class Section extends Component {
  render() {
    const { title, key, children, seeMorePress, seeMoreText, showSeeMore } = this.props;
    return (
      <View key={key} style={styles.section}>
        <View style={styles.sectionTitle}>
          <Text style={styles.sectionTitleText}>{title}</Text>
          {showSeeMore && seeMoreText &&
            <TouchableOpacity onPress={seeMorePress}>
              <Text style={styles.seeMoreLink}>{seeMoreText}</Text>
            </TouchableOpacity>
          }
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
    paddingBottom: 20,
    elevation: 2,
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
    paddingTop: 15,
    paddingBottom: 0,
    top: IOS ? 3 : 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleText: typography.h1(),
  seeMoreLink: {
    color: theme.secondary,
    top: IOS ? 0 : 2,
    fontSize: 15,
    // fontFamily: IOS ? 'Futurice' : 'Futurice_bold',
  },
});

Section.defaultProps = {
  title: '',
  key: '',
  children: null,
  seeMorePress: noop,
  seeMoreText: null,
  showSeeMore: false,
}

export default Section;
