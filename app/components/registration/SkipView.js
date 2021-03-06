'use strict';

import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';

import AnimateMe from '../AnimateMe';
import Text from '../common/MyText';
import theme from '../../style/theme';
import PlatformTouchable from '../../components/common/PlatformTouchable';

const { width, height } = Dimensions.get('window');

const IOS = Platform.OS === 'ios';

class SkipView extends Component {

  render() {
    const { loginFailed, onPressMainAction } = this.props;
    return (
      <View style={styles.container}>
        <ScrollView style={{flex:1, width: null, height: null}}>
          <View style={styles.content}>
            <View style={styles.textContainer}>
              <Image
                resizeMode="contain"
                style={{ width: 120, height: 70, tintColor: theme.primary }}
                source={require('../../../assets/logo/new.png')}
              />
              <Text style={styles.text}>Login with your company email address
              </Text>
            </View>
            {loginFailed &&
              <AnimateMe animationType="fade-from-bottom" duration={150}>
                <Text style={styles.loginError}>Unfortunately there was a problem with login.</Text>
              </AnimateMe>
            }
            <PlatformTouchable onPress={onPressMainAction} activeOpacity={0.8}>
              <View style={styles.loginButton}>
                <Text style={styles.loginButtonText}>LOG IN</Text>
              </View>
            </PlatformTouchable>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: theme.yellow,
  },
  content: {
    margin: 20,
    marginTop: 20,
    marginBottom: 15,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
  },
  topArea: {
    backgroundColor: theme.yellow,
    minHeight: height / 2.5,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  iconWrap: {
    overflow: 'hidden',
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(255,255,255,.1)',
    left: width / 2 - 95,
    top: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    // width: 190,
    // left: width / 2 - 100,
    // top: 50,
    // position: 'absolute',
    textAlign: 'center',
    opacity: 1,
    backgroundColor: theme.transparent,
    fontSize: 150,
    width: 150,
    height: 150,
    // tintColor: theme.blue2,
    color: theme.blue2,
  },
  subIcon: {
    backgroundColor: theme.transparent,
    color: theme.accentLight,
    fontSize: 60,
    right: 50,
    top: 30,
    position: 'absolute'
  },
  bgImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: 190,
    height: 190,
    bottom: 0,
    opacity: 0.3
  },

  textContainer: {
    flex: 3,
    alignItems: 'center',
    flexDirection: 'column'
  },
  subTitle: {
    textAlign: 'center',
    color: theme.secondary,
    fontWeight: '600',
    fontSize: 16,
    margin: 15,
    marginTop: 30,
  },
  text: {
    marginTop: 35,
    marginBottom: 20,
    fontSize: 16,
    lineHeight: 20,
    color: theme.primary,
    textAlign: 'center',
  },
  loginError: {
    color: theme.red,
    marginTop: -8,
    marginBottom: -9,
  },
  loginButton: {
    marginTop: 40,
    marginBottom: 10,
    padding: 5,
    paddingTop: IOS ? 14 : 12,
    paddingBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: IOS ? 25 : 3,
    elevation: 3,
    backgroundColor: theme.primary,
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

export default SkipView;
