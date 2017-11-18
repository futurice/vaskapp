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
import autobind from 'autobind-decorator';
import Icon from 'react-native-vector-icons/Ionicons';
import MdIcon from 'react-native-vector-icons/MaterialIcons';

import Text from '../common/MyText';
import AnimateMe from '../AnimateMe';
import theme from '../../style/theme';

import PlatformTouchable from '../../components/common/PlatformTouchable';
import RegistrationFailedGuide from './RegistrationFailedGuide';
import { isIphoneX } from '../../services/device-info';

const IOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');

const baseWidth = 375;
const sizeRatio = isIphoneX ? 1.15 : width / baseWidth;
const vw = size => sizeRatio * size;

const heroLeft = (width / 2) - (height / 5);

class InstructionView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      springAnim: new Animated.Value(0),
      showGuide: false,
    };
  }

  @autobind
  toggleGuide() {
    this.setState({ showGuide: !this.state.showGuide });
  }

  render() {
    const { loginFailed, onPressMainAction } = this.props;
    const { showGuide } = this.state;
    const containerStyles = [styles.container, { paddingTop: isIphoneX ? 30 : 20 }];

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
      {showGuide
        ? <RegistrationFailedGuide onClose={this.toggleGuide} />
        : <View style={containerStyles}>
          <View style={styles.topArea}>
            <View style={styles.iconWrap}>
              <AnimateMe style={{ flex: 0 }} animationType="fade-from-bottom" duration={300} delay={1500}>
                <AnimateMe
                  style={[{ flex: 1, left: heroLeft + vw(35), top: vw(-30), transform: [{ rotate: '5deg' }] }, styles.emoji]}
                  animationType="shake3" duration={2100} delay={1500} infinite>
                  <Text style={{fontSize: vw(45)}}>🦄</Text>
                </AnimateMe>
              </AnimateMe>

              <AnimateMe style={{ flex: 0 }} animationType="fade-from-right" duration={400} delay={2000}>
                <AnimateMe style={{ flex: 0 }} animationType="shake3" duration={3000} delay={1500} infinite>
                  <View style={[{ top: vw(45), left: vw(-3), transform: [{ rotate: '5deg' }] }, styles.emoji]}>
                    <Text style={{fontSize: vw(45)}}>🚴</Text>
                  </View>
                </AnimateMe>
              </AnimateMe>

              <AnimateMe style={{ flex: IOS ? 0 : 1 }} animationType="fade-from-bottom" duration={400} delay={1200}>
                <Image
                  style={[{ position: 'absolute' }, styles.mainImage]}
                  resizeMode="contain"
                  source={require('../../../assets/illustrations/planet-purple.png')} />
              </AnimateMe>

              <AnimateMe style={{ flex: IOS ? 0 : 1 }} animationType="fade-in" duration={400} delay={2200}>
                <AnimateMe style={{ flex: 0 }} animationType="shake2" duration={2000} delay={1500} infinite>
                  <View style={[{ right: heroLeft + vw(2),  top: vw(5)}, styles.emoji]}>
                    <Text style={{fontSize: vw(42), transform: [{ rotate: '6deg' }] }}>🕹️</Text>
                  </View>
                </AnimateMe>
              </AnimateMe>

              <AnimateMe style={{ flex: IOS ? 0 : 1 }} animationType="fade-from-bottom" duration={400} delay={2900}>
                <AnimateMe style={{ flex: 0 }} animationType="shake2" duration={2000} delay={1500} infinite>
                  <View style={[{ right: vw(39), top: vw(91), transform: [{ rotate: '-5deg' }] }, styles.emoji]}>
                    <Text style={[{fontSize: vw(15)}, styles.floatText]} bold>#thank️</Text>
                  </View>
                </AnimateMe>
              </AnimateMe>

              <AnimateMe style={{ flex: 0 }} animationType="fade-in" duration={400} delay={2500}>
                <AnimateMe
                  style={[{ flex: 1, right: vw(35), top: vw(110) }, styles.emoji]}
                  animationType="shake2" duration={2000} delay={1500} infinite
                >
                  <Text style={{fontSize: vw(50), transform: [{ rotate: '-5deg' }] }}>🙏</Text>
                </AnimateMe>
              </AnimateMe>

              <AnimateMe style={{ flex: 1 }} animationType="fade-in" duration={400} delay={2600}>
                <AnimateMe style={{ flex: 1 }} animationType="shake" duration={1500} delay={500} infinite>
                  <View style={[{ bottom: vw(10), left: vw(15), transform: [{ rotate: '5deg' }] }, styles.emoji]}>
                    <Text style={{fontSize: vw(70)}}>🍕</Text>
                  </View>
                </AnimateMe>
              </AnimateMe>



              <AnimateMe
                style={[{ flex: 1, top: vw(12), right: heroLeft + vw(60), transform: [{ rotate: '10deg' }] }, styles.emoji]}
                animationType="fade-in" duration={400} delay={1600}
              >
                <Text stylestyle={{ fontSize: vw(25)}}>✨✨</Text>
              </AnimateMe>

            <AnimateMe
              style={[{ flex: 1, bottom: 40, right: heroLeft + vw(40), transform: [{ rotate: '-20deg' }] }, styles.emoji]}
              animationType="fade-in" duration={400} delay={1800}
            >
              <Text style={{fontSize: vw(12)}}>✨✨</Text>
            </AnimateMe>


            </View>
          </View>

          <ScrollView style={{ flex:1 }}>
            <View style={styles.container}>
              <View style={styles.bottomArea}>
                <View style={styles.content}>
                  <View style={styles.textContainer}>
                    <Text style={styles.subTitle} bold>Praise Your Culture</Text>
                    <Text style={styles.text}>Login with your company Google account.</Text>
                  </View>
                  {loginFailed &&
                    <AnimateMe style={styles.loginError} animationType="fade-from-bottom" duration={150}>
                      <View>
                        <TouchableOpacity onPress={this.toggleGuide}>
                          <Text style={[styles.loginErrorLink, styles.loginErrorText]}>
                            Unfortunately there was a problem with login...
                          </Text>
                        </TouchableOpacity>
                      </View>
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
                          <Text style={styles.loginButtonText} bold>GET STARTED</Text>
                      </PlatformTouchable>
                    </View>
                  </View>
                  :
                    <PlatformTouchable
                      onPress={onPressMainAction}
                      activeOpacity={0.8}
                    >
                      <View style={styles.loginButton}>
                        <Text style={styles.loginButtonText}>GET STARTED</Text>
                      </View>
                    </PlatformTouchable>
                }
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        }
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
    minHeight: height / 2,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 15,
  },
  bottomArea: {
    flex: 1,
  },
  iconWrap: {
    position: 'absolute',
    width: height / 2.5,
    height: height / 2.5,
    backgroundColor: 'transparent',
    left: (width / 2) - (height / 5),
    top: IOS ? vw(50) : 50,
    overflow: 'visible'
  },
  mainImage: {
    width: height / 2.5,
    height: height / 2.5,
  },
  emoji: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  floatText: {
    backgroundColor: 'transparent',
    color: theme.gold,
    fontWeight: 'bold',
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
    fontSize: vw(22),
    margin: 15,
    marginTop: 30,
    marginBottom: vw(9),
    fontWeight: IOS ? 'bold' : 'normal',
  },
  text: {
    fontSize: IOS ? vw(14) : 15,
    lineHeight: IOS ? vw(20) : 20,
    marginTop: 0,
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
    marginTop: 10,
    marginBottom: -10,
  },
  loginErrorLink: {
    textDecorationLine: 'underline',
    marginTop: 10,
  },
  loginErrorText: {
    color: theme.red,
    textAlign: 'center',
    fontSize: vw(14),
    lineHeight: vw(17),
  },
  loginButton: {
    marginTop: 40,
    marginBottom: 10,
    padding: 5,
    paddingVertical: 10,
    paddingTop: IOS ? 11 : 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: vw(25),
    elevation: 2,
    backgroundColor: theme.stable,
    width: vw(250),
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: {
      height: 10,
      width: 0
    }
  },
  loginButtonText: {
    fontSize: 16,
    lineHeight: 20,
    paddingTop: IOS ? 5: 0,
    fontWeight: IOS ? 'bold' : 'normal',
    color: theme.secondaryClear
  }
});

export default InstructionView;
