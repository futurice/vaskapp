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

import LinearGradient from 'react-native-linear-gradient';
import Text from '../common/MyText';
import AnimateMe from '../AnimateMe';
import theme from '../../style/theme';

import Icon from 'react-native-vector-icons/Ionicons';
import MdIcon from 'react-native-vector-icons/MaterialIcons';
import PlatformTouchable from '../../components/common/PlatformTouchable';
import { isIphoneX } from 'react-native-iphone-x-helper';

const IOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');

class InstructionView extends Component {
  constructor(props) {
     super(props);
     this.state = {
       springAnim: new Animated.Value(0),
     };
   }

  render() {
    const { loginFailed, onPressMainAction } = this.props;
    const containerStyles = [styles.container, isIphoneX() && { paddingTop: 30, }];

    // TODO image animation
    const { springAnim } = this.state;
    const active = springAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.2, 1] });
    const unactive = springAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1, 1] });

    return (
      <LinearGradient
        style={{ flex: 1 }}
        locations={[0, 1]}
        start={{x: 0.35, y: 0}}
        end={{x: 1, y: 1}}
        colors={[theme.gold, theme.goldDark]}
      >
       <View style={containerStyles}>

          <View style={styles.topArea}>
            <View style={styles.iconWrap}>

              <AnimateMe style={{ flex: 0 }} animationType="fade-from-bottom" duration={300} delay={1500}>
                <AnimateMe style={{ flex: 0 }} animationType="shake3" duration={4000} delay={1500} infinite>
                  <View style={{ left: 35, top: -23, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', position: 'absolute', transform: [{ rotate: '5deg' }] }}>
                    <Text style={{fontSize: 40, backgroundColor: 'transparent'}}>🦄</Text>
                  </View>
                </AnimateMe>
              </AnimateMe>

              <AnimateMe style={{ flex: 0 }} animationType="fade-from-right" duration={400} delay={2000}>
                <AnimateMe style={{ flex: 0 }} animationType="shake3" duration={3000} delay={1500} infinite>
                  <View style={{ top: 45, left: -5, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', position: 'absolute', transform: [{ rotate: '5deg' }] }}>
                    <Text style={{fontSize: 45, backgroundColor: 'transparent'}}>🚴</Text>
                  </View>
                </AnimateMe>
              </AnimateMe>

              <AnimateMe style={{ flex: IOS ? 0 : 1 }} animationType="fade-from-bottom" duration={400} delay={1200}>
                <Image
                  style={{ right: 10, top: -5, width: 180, height: 180, position: 'absolute' }}
                  resizeMode="contain"
                  source={require('../../../assets/illustrations/planet-purple.png')} />
              </AnimateMe>

              <AnimateMe style={{ flex: IOS ? 0 : 1 }} animationType="fade-in" duration={400} delay={2200}>
                <AnimateMe style={{ flex: 0 }} animationType="shake2" duration={2000} delay={1500} infinite>
                  <View style={{ right: 20,  top: 5, justifyContent: 'center', alignItems: 'center', position: 'absolute', transform: [{ rotate: '-5deg' }] }}>
                    <Text style={{fontSize: 40, backgroundColor: 'transparent'}}>🕹️</Text>
                  </View>
                </AnimateMe>
              </AnimateMe>

              <AnimateMe style={{ flex: IOS ? 0 : 1 }} animationType="fade-from-bottom" duration={400} delay={2900}>
                <AnimateMe style={{ flex: 0 }} animationType="shake2" duration={2000} delay={1500} infinite>
                  <View style={{ right: 36,  top: 65, justifyContent: 'center', alignItems: 'center', position: 'absolute', transform: [{ rotate: '-5deg' }] }}>
                    <Text style={{fontSize: 15, backgroundColor: 'transparent', color: theme.gold, fontWeight: 'bold'}} bold>#thank️</Text>
                  </View>
                </AnimateMe>
              </AnimateMe>

              <AnimateMe style={{ flex: 0 }} animationType="fade-in" duration={400} delay={2500}>
                <AnimateMe style={{ flex: 1 }} animationType="shake2" duration={2000} delay={1500} infinite>
                  <View style={{ right: 35, top: 76, justifyContent: 'center', alignItems: 'center', position: 'absolute', transform: [{ rotate: '-5deg' }] }}>
                    <Text style={{fontSize: 45, backgroundColor: 'transparent'}}>🙏</Text>
                  </View>
                </AnimateMe>
              </AnimateMe>

              <AnimateMe style={{ flex: 1 }} animationType="fade-in" duration={400} delay={2600}>
                <AnimateMe style={{ flex: 1 }} animationType="shake" duration={1500} delay={500} infinite>
                  <View style={{ bottom: 10, left: 15, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', position: 'absolute', transform: [{ rotate: '5deg' }] }}>
                    <Text style={{fontSize: 70, backgroundColor: 'transparent'}}>🍕</Text>
                  </View>
                </AnimateMe>
              </AnimateMe>



              <AnimateMe style={{ flex: 0 }} animationType="fade-in" duration={400} delay={1600}>
                <View style={{ bottom: 190, right: 50, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', position: 'absolute', transform: [{ rotate: '10deg' }] }}>
                  <Text stylestyle={{ fontSize: 25, backgroundColor: 'transparent'}}>✨✨</Text>
                </View>
              </AnimateMe>

            <AnimateMe style={{ flex: 0 }} animationType="fade-in" duration={400} delay={1800}>
              <View style={{ bottom: 40, right: 70, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', position: 'absolute', transform: [{ rotate: '-20deg' }]}}>
                <Text style={{fontSize: 12, backgroundColor: 'transparent'}}>✨✨</Text>
              </View>
            </AnimateMe>


            </View>
          </View>

          <ScrollView style={{flex:1, width: null, height: null}}>
            <View style={styles.container}>
              <View style={styles.bottomArea}>

                  <View style={styles.content}>
                    <View style={styles.textContainer}>
                    {/*
                      <Image
                        resizeMode="contain"
                        style={{ width: 120, height: 70, tintColor: theme.secondaryDark }}
                        source={require('../../../assets/logo/new.png')}
                      />
                    */}
                      <Text style={styles.subTitle} bold>Praise the Culture</Text>
                      <Text style={styles.text}>Login with your company Google account.</Text>
                    </View>

                   {loginFailed &&
                      <AnimateMe animationType="fade-from-bottom" duration={150}>
                        <Text style={styles.loginError}>Unfortunately there was a problem with login.</Text>
                      </AnimateMe>
                    }


                    {!IOS
                    ?
                    <View style={styles.loginButton}>
                      <View style={{ flex: 1 }}>
                        <PlatformTouchable
                          onPress={onPressMainAction}
                          background={PlatformTouchable.SelectableBackgroundBorderless()}
                        >
                            <Text style={styles.loginButtonText}>LOG IN</Text>
                        </PlatformTouchable>
                      </View>
                    </View>
                    :
                      <PlatformTouchable
                        onPress={onPressMainAction}
                        activeOpacity={0.8}
                      >
                        <View style={styles.loginButton}>
                          <Text style={styles.loginButtonText}>LOG IN</Text>
                        </View>
                      </PlatformTouchable>
                  }

                  </View>
                </View>
              </View>
            </ScrollView>
        </View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.transparent,
    alignSelf: 'stretch'
  },
  area: {
    alignItems: 'stretch'
  },
  topArea: {
    backgroundColor: theme.transparent,
    minHeight: height / 2.3,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 30,
  },
  bottomArea: {
    flex: 1,
  },
  iconWrap: {
    /*
    width,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
    */
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 0,
    backgroundColor: 'rgba(255,255,255,0)',
    left: width / 2 - 100,
    top: IOS ? 100 : 50,
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
    color: theme.secondaryClear,
    fontSize: 22,
    margin: 15,
    marginTop: 30,
    marginBottom: 15,
    fontWeight: IOS ? 'bold' : 'normal',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 0  ,
    color: theme.secondaryClear,
    opacity: 0.8,
    textAlign: 'center',
  },
  button: {
    height: 120,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
    borderRadius: 50,
  },
  loginError: {
    color: theme.red,
    marginTop: -8,
    marginBottom: -9,
    top: 10,
  },
  loginButton: {
    marginTop: 40,
    marginBottom: 10,
    padding: 5,
    paddingTop: IOS ? 14 : 12,
    paddingBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    elevation: 6,
    backgroundColor: theme.secondaryClear,
    width: 250,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {
      height: 10,
      width: 0
    }
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: IOS ? 'bold' : 'normal',
    color: theme.white,
    fontFamily: IOS ? 'Futurice' : 'Futurice_bold'
  }
});

export default InstructionView;
