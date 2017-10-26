'use strict';

import React, { Component, PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image
} from 'react-native';
import PlatformTouchable from '../common/PlatformTouchable';

import theme from '../../style/theme';
import typography from '../../style/typography';
import { getNameInitials } from '../../utils/name-format';

class Team extends Component {
  propTypes: {
    name: PropTypes.string.isRequired,
    logo: PropTypes.string.isRequired,
    teamid: PropTypes.number.isRequired,
    selected: PropTypes.number.isRequired,
    onPress: PropTypes.func.isRequired
  }

  render() {
    const { logo, name, onPress, teamid, selected } = this.props;
    const isSelected = teamid === selected;
    return (
      <View style={styles.item}>
        <PlatformTouchable
          delayPressIn={1}
          style={{}}
          onPress={this.props.onPress}>
          <View style={styles.button}>

          {/*
          <Image
            source={this.props.logo === null ? null : { uri: this.props.logo }}
            style={[styles.teamLogo, {borderColor: isSelected ? theme.primary : '#f2f2f2'}]} />
          */}
          <View style={[styles.teamLogo, { borderColor: isSelected ? theme.primary : '#f2f2f2' }]}>
            <Text style={styles.teamInitials}>{getNameInitials(name)}</Text>
          </View>
          <Text style={[styles.text, {color: isSelected ? theme.primary : '#666'}]}>
            {name}
          </Text>
          </View>
        </PlatformTouchable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    borderBottomColor:'#eee',
    borderBottomWidth:1,

  },
  teamLogo:{
    borderRadius:20,
    width:40,
    height:40,
    marginRight:15,
    borderWidth:3,
    backgroundColor: theme.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamInitials: {
    fontSize: 18,
    backgroundColor: 'transparent',
    color: theme.dark,
  },
  text: Object.assign({}, typography.h2, { marginBottom: 0 }),
  button: {
    padding:15,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:10,
    flex:1,
    flexDirection:'row',
    alignItems:'center'
  }
});

export default Team;
