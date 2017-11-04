import React, { Component } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { toArray } from 'lodash';
import { connect } from 'react-redux';

import { getFeedSortType, setFeedSortType } from '../../concepts/sortType';

import Text from '../common/MyText';
import theme from '../../style/theme';
import SortTypes from '../../constants/SortTypes';

const sortTypeTitles = {
  [SortTypes.SORT_NEW]: 'fresh',
  [SortTypes.SORT_HOT]: 'hot',
};

class SortSelector extends Component {
  constructor(props) {
    super(props);

    this.state = { indicatorAnimation: new Animated.Value(0) };
  }

  componentWillReceiveProps({ selectedSortType }) {
    if (selectedSortType !== this.props.selectedSortType) {
      const sortTypeOptions = toArray(SortTypes);
      const selectedSortTypeIndex = sortTypeOptions.indexOf(selectedSortType);
      this.animateIndicator(selectedSortTypeIndex);
    }
  }

  // 'toValue' can be 0 | 1
  animateIndicator(toValue) {
    const { indicatorAnimation } = this.state;

    Animated.timing(indicatorAnimation, { toValue, duration: 512, easing: Easing.elastic(1) }).start();
  }

  render() {
    const { selectedSortType } = this.props;
    const { indicatorAnimation, indicatorAnimationPartTwo } = this.state;

    const sortTypeOptions = toArray(SortTypes);
    const selectedSortTypeIndex = sortTypeOptions.indexOf(selectedSortType);
    const nextSortTypeItem = selectedSortTypeIndex >= sortTypeOptions.length - 1
      ? sortTypeOptions[0]
      : sortTypeOptions[selectedSortTypeIndex + 1];

    const animatedIndicatorStyles = {
      top: indicatorAnimation.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 0, 8] }),
      height: indicatorAnimation.interpolate({ inputRange: [0, 0.5, 1], outputRange: [6, 14, 6] }),
    };

    const onSortSelectorPress = () => this.props.setFeedSortType(nextSortTypeItem);

    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={onSortSelectorPress}
      >
        <View style={styles.sortSelector}>
          <TouchableOpacity onPress={onSortSelectorPress}>
            <Text style={styles.filterText}>
              {sortTypeTitles[selectedSortType]}
            </Text>
          </TouchableOpacity>
          <View style={styles.indicators}>
            {sortTypeOptions.map((type, index) =>
              <View
                key={type}
                style={styles.indicator}
              />
            )}

            <Animated.View style={[styles.indicator, styles.activeIndicator, animatedIndicatorStyles ]}/>

          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  sortSelector: {
    top: 1,
    paddingTop: 14,
    paddingRight: 25,
    paddingLeft: 25,
  },
  filterText: {
    color: theme.grey4,
    fontSize: 14,
    top: 1,
  },
  indicators: {
    position: 'absolute',
    left: 10,
    top: 12,
    width: 8,
    alignItems: 'center',
    height: 20,
    backgroundColor: 'transparent',
  },
  indicator: {
    marginTop: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    opacity: 0.4,
    backgroundColor: theme.grey4,
  },
  activeIndicator: {
    opacity: 1,
    backgroundColor: theme.secondary,
    position: 'absolute',
    zIndex: 1,
  }
});


const mapDispatchToProps = { setFeedSortType };

const select = state => {
  return {
    selectedSortType: getFeedSortType(state)
  }
};

export default connect(select, mapDispatchToProps)(SortSelector);
