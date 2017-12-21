  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import React, { Component, PropTypes } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { noop } from 'lodash'
import MDIcon from 'react-native-vector-icons/MaterialIcons';

import theme from '../../style/theme';

const LocateButton = ({ onPress, isLocating }) => (
  <View style={styles.button}>
    <TouchableOpacity
      onPress={onPress}
      style={styles.buttonText}
    >
        <MDIcon size={20} style={{ color: isLocating ? theme.secondary : '#aaa' }} name='navigation' />
    </TouchableOpacity>
  </View>
);


const styles = StyleSheet.create({
  button:{
    backgroundColor: 'rgba(255,255,255,.99)',
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      height: 5,
      width: 0
    },
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 12,
    top: 12,
    width: 40,
    height: 40
  },
  buttonContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});


export default LocateButton;