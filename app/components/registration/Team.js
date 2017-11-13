import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';
import PlatformTouchable from '../common/PlatformTouchable';

import Text from '../common/MyText';
import theme from '../../style/theme';
import typography from '../../style/typography';
import { getNameInitials } from '../../utils/name-format';

const IOS = Platform.OS === 'ios';

class Team extends Component {
  render() {
    const { logo, last, name, onPress, teamid, selected } = this.props;
    const isSelected = teamid === selected;
    return (
      <View style={[styles.item, last && styles.last]}>
        <PlatformTouchable
          delayPressIn={1}
          style={{}}
          onPress={this.props.onPress}>
          <View style={styles.button}>

          <View style={[styles.teamLogo, { borderColor: isSelected ? theme.secondary : '#f2f2f2' }]}>
            {logo
            ? <Image
                source={{ uri: logo }}
                style={styles.teamLogoImage} />
            : <Text style={[styles.teamInitials, { color: isSelected ? theme.secondary : theme.dark }]}>
                {getNameInitials(name, 1)}
              </Text>
            }
          </View>
          <Text style={[styles.text, { color: isSelected ? theme.secondary : '#666' }]}>
            {name}
          </Text>
          </View>
        </PlatformTouchable>
      </View>
    );
  }
}

Team.propTypes = {
  name: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  teamid: PropTypes.number.isRequired,
  selected: PropTypes.number,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  item: {
    borderBottomColor:'#f4f4f4',
    borderBottomWidth: 1,
  },
  last: {
    borderBottomWidth: 0,
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
  teamLogoImage: {
    borderRadius:20,
    width:40,
    height:40,
  },
  teamInitials: {
    fontSize: 18,
    backgroundColor: 'transparent',
    color: theme.dark,
    top: IOS ? 3 : 0,
  },
  text: typography.h2({ marginBottom: 0, top: IOS ? 2 : 0, backgroundColor: 'transparent' }),
  button: {
    paddingVertical: 12,
    flex:1,
    flexDirection:'row',
    alignItems:'center'
  }
});

export default Team;
