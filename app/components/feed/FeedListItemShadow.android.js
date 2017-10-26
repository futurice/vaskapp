import React from 'react';
import { View } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

const FeedListItemShadow = () => (
  <View>
    <LinearGradient
      colors={['rgba(0,0,0,.2)', 'transparent']}
      style={{
        zIndex: 2,
        position: 'absolute',
        bottom:0,
        right: 0,
        left: 0,
        height: 51,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    }} />
    <View
      style={{
        zIndex: 3,
        backgroundColor: '#ccc',
        position: 'absolute',
        bottom: 50,
        top: 10,
        width: 10,
        left: 0,
        borderTopLeftRadius: 20,
    }} />
    <LinearGradient
      start={{x: 0.0, y: 0.49}} end={{x: 1, y: 0.5}}
      colors={['rgba(255,255,255,1)', 'rgba(255,255,255,.2)']}
      style={{
        zIndex: 4,
        position: 'absolute',
        bottom: 0,
        top: 10,
        width: 15,
        left: 0,
        borderBottomLeftRadius: 10,
        borderTopLeftRadius: 10,
    }} />
    <View
      style={{
        zIndex: 3,
        backgroundColor: '#ccc',
        position: 'absolute',
        bottom:50,
        top: 12,
        width: 10,
        right: 0,
        borderTopRightRadius: 20,
    }} />
    <LinearGradient
      start={{x: 0.0, y: 0.5}} end={{x: 1, y: 0.49}}
      colors={['rgba(255,255,255,.2)', 'rgba(255,255,255,1)']}
      style={{
        zIndex: 4,
        position: 'absolute',
        bottom:0,
        top: 10,
        width: 15,
        right: 0,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
    }} />
  </View>
);