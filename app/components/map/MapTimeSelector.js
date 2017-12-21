import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Platform,
} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';

import Text from '../common/MyText';
import theme from '../../style/theme';
import locationService from '../../services/location';
const IOS = Platform.OS === 'ios';

const { width } = Dimensions.get('window');

const containerWidth = 210;
const verticalPosition = (width - containerWidth) / 2;
const styles = StyleSheet.create({
  container: {
    width: containerWidth,
    height: 40,
    borderRadius: 30,
    backgroundColor: theme.white,
    position: 'absolute',
    bottom: 20,
    left: verticalPosition,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    elevation: 2,
    shadowColor: theme.secondaryDark,
    shadowOpacity: 0.11,
    shadowRadius: 7,
    shadowOffset: {
      height: 5,
      width: 0
    },
  },
  button: {
    paddingHorizontal: 15,
  },
  buttonText: {
    backgroundColor: 'transparent',
    color: theme.midgrey,
  },
  buttonActive: {
    color: theme.secondaryClear,
  }
});

const timeOptions = [
  { name: '24 hours', value: 1, period: 'day' },
  { name: '7 days', value: 2, period: 'days' },
]

const MapTimeSelector = ({ selected = 0, onSelect }) => {
    return (
      <View style={styles.container}>
        {timeOptions.map((option, index) =>
          <View style={styles.button}>
            <Text style={[styles.buttonText, index === selected && styles.buttonActive]}>
              {option.name}
            </Text>
          </View>
        )}
      </View>
  );
};

export default MapTimeSelector;
