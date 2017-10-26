'use strict';

import React, { Component } from 'react';
import {
  View,
  Animated,
  Image,
  StyleSheet,
  Easing,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';


import Text from '../common/MyText';
import theme from '../../style/theme';

import Icon from 'react-native-vector-icons/Ionicons';
import MdIcon from 'react-native-vector-icons/MaterialIcons';

const IOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');

class InstructionView extends Component {
  constructor(props) {
     super(props);
     this.state = {
       springAnim: new Animated.Value(0),
     };
   }

   handlePress(id) {
     this.props.onSelect(id);

     this.state.springAnim.setValue(0);
      Animated.timing(
        this.state.springAnim,
        {
          toValue: 1,
          duration: 800,
          easing: Easing.elastic(1)}
      ).start();
   }

  render() {
    const containerStyles = [styles.container, styles.modalBackgroundStyle];
    const { springAnim } = this.state;

    const active = springAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.2, 1] });
    const unactive = springAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1, 1] });

    return (
       <View style={containerStyles}>

          <View style={styles.topArea} level={20}>
            <View style={styles.iconWrap}>

              <Image
                style={{ left: 20, top: -15,  width: 60, height: 60, position: 'absolute' }}
                resizeMode="contain"
                source={require('../../../assets/chilicorn.png')} />

              <Image
                style={{ right: 5, top: -5, width: 180, height: 180, position: 'absolute' }}
                resizeMode="contain"
                source={require('../../../assets/illustrations/planet.png')} />

              <Image
                style={{ right: 30, bottom: 55, overflow: 'visible', width: 40, height: 40, position: 'absolute',}}
                resizeMode="contain"
                source={require('../../../assets/illustrations/chat-dark.png')} />

              <View style={{ right: 20,  top: 5,  backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', width: 36, height: 36, borderRadius: 21, position: 'absolute', transform: [{ rotate: '-5deg' }] }}>
                <MdIcon
                  style={{ fontSize: 20, color: theme.white, backgroundColor: 'transparent' }}
                  name="hot-tub" />
              </View>


              <View style={{ bottom: 60, left: 25, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center', width: 36, height: 36, borderRadius: 21, position: 'absolute', transform: [{ rotate: '5deg' }] }}>
                <Icon
                  style={{ fontSize: 20, top: 2, color: theme.white, backgroundColor: 'transparent' }}
                  name="md-trophy"  />
              </View>

            </View>
          </View>

          <ScrollView style={{flex:1, width: null, height: null}}>
            <View style={styles.container}>
              <View style={styles.bottomArea}>

                  <View style={styles.content}>
                    <View style={styles.textContainer}>

                      <Image
                        resizeMode="contain"
                        style={{ width: 120, height: 70, tintColor: theme.primary }}
                        source={require('../../../assets/logo/vask.png')}
                      />
                      <Text style={styles.subTitle}>Praise the Culture</Text>
                      {/*<Text style={styles.text}>of your team</Text>*/}
                    </View>
                  </View>
                </View>

              </View>
            </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.yellow,
    alignSelf: 'stretch'
  },
  area: {
    alignItems: 'stretch'
  },
  topArea: {
    backgroundColor: theme.yellow,
    minHeight: height / 2.3,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  bottomArea: {
    flex: 1,
  },
  iconWrap: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(0,0,0,0.05)',
    left: width / 2 - 90,
    top: IOS ? width / 6 : width / 8,
    overflow: 'visible'
  },
  icon: {
    // width: 210,
    // left: width / 2 - 100,
    // top: 50,
    // position: 'absolute',
    textAlign: 'center',
    opacity: 1,
    backgroundColor: theme.transparent,
    width: 150,
    height: 150,
    // tintColor: theme.white,
    color: theme.white,
  },
  subIcon: {
    backgroundColor: theme.transparent,
    color: theme.accentLight,
    fontSize: 60,
    right: 40,
    top: 10,
    position: 'absolute'
  },
  subImage: {
    width: 150,
    height: 150,
    left: 0,
    bottom: 0,
    position: 'relative',
    zIndex: 2,
  },
  accentImage: {
    width: 40,
    height: 25,
    left: 5,
    top: 55,
    position: 'absolute',
    zIndex: 1,
  },
  bgImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: 180,
    height: 180,
    borderRadius: 95,
    bottom: 0,
    opacity: 0.01
  },
  content: {
    margin: 20,
    marginTop: 20,
    marginBottom: 15,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    flexDirection: 'column'
  },
  subTitle: {
    color: theme.primary,
    fontSize: 20,
    margin: 15,
    marginTop: 35,
    marginBottom: 10,
    // fontFamily: IOS ? 'Futurice' : 'Futurice_bold',
  },
  text: {
    fontSize: 20,
    lineHeight: 22,
    marginTop: 0  ,
    color: theme.blue1,
    textAlign: 'center',
  },
  cities: {
    marginTop: 0,
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1
  },
  button: {
    height: 120,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    borderRadius: 50,
  },
  touchable: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },
  circle: {
    flex: 1,
    backgroundColor: theme.secondary,
    padding: 12,
    paddingTop: 16,
    borderWidth: 2,
    borderColor: theme.white,
    alignItems: 'center',
    borderRadius: 50,
  },
  cityIcon: {
    width: 40,
    height: 40,
    zIndex: 4,
  },
  cityText: {
    fontSize: 12,
    color: theme.white,
    fontWeight: '500',
    marginBottom: 10,
    backgroundColor: 'transparent',
    zIndex: 3,
  },
  activeCityText: {
    color: theme.accentLight
  },
  cityTitle: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checked: {
    zIndex: 2,
    position: 'absolute',
    bottom: 5,
    right: 35,
    fontSize: 25,
    color: theme.accentLight,
    opacity: 1,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  bottomButtons:{
    flex:1,
    flexDirection:'column',
    margin:0,
    marginBottom:0,
    marginLeft:0,
    marginRight:0,
    height: 50,
    alignItems:'stretch',
    position:'absolute',
    bottom:0,
    left:0,
    right:0,
  },
  modalButton: {
    borderRadius:0,
    flex:1,
    marginLeft:0,
  }
});

export default InstructionView;
