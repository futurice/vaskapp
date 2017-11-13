'use strict';

import React, { Component } from 'react';

import {
  View,
  Text,
  TextInput,
  Platform,
  Dimensions,
  Animated,
  StyleSheet,
  TouchableHighlight,
  KeyboardAvoidingView,
  Modal
} from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import theme from '../../style/theme';
import Button from '../common/Button';
import SubmitButton from './SubmitButton';

import {
  postText,
  closeTextActionView
} from '../../concepts/competition';

const IOS = Platform.OS === 'ios';

const { width, height } = Dimensions.get('window');

class TextActionView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      formAnimation: new Animated.Value(1),
      okAnimation: new Animated.Value(0),
      sendDone: false,
    }
  }

  componentWillReceiveProps({ isTextActionViewOpen }) {
    // when opening again
    if (isTextActionViewOpen && !this.props.isTextActionViewOpen){
      this.hideOK();
      this.setState({text: ''});
    }
  }

  showOK() {
    this.setState({ sendDone: true });
    // Animated.spring(this.state.okAnimation, { toValue: 1, duration: 250 }).start();
    // Animated.timing(this.state.formAnimation, { toValue: 0, duration: 100 }).start();
  }

  hideOK() {
    this.setState({ sendDone: false });
    // this.state.formAnimation.setValue(1);
    // this.state.okAnimation.setValue(0);
  }

  @autobind
  onChangeText(text) {
    this.setState({text: text});
  }

  @autobind
  onClose() {
    this.setState({text: ''});
    this.props.closeTextActionView();
  }

  @autobind
  onSendText() {

    if (!this.state.text.length) {
      this.onClose();
      return;
    }

    this.showOK();
    this.props.postText(this.state.text);

    // setTimeout(() => {
    //   reset values for the next time
    //   this.hideOK();
    // }, 100);

    // setTimeout(() => {
    //   this.onClose();
    // }, 600);

  }

  render() {

    const { isTextActionViewOpen } = this.props;

    if (!isTextActionViewOpen) {
      return false;
    }

    return (
      <Modal
        onRequestClose={this.onClose}
        visible={isTextActionViewOpen}
        animationType={'slide'}
      >
        <LinearGradient
          style={styles.container}
          locations={[0, 1]}
          start={{x: 0.5, y: 0}}
          end={{x: 1, y: 1}}
          colors={[theme.gold, theme.goldDark]}
        >

          <TouchableHighlight underlayColor="#f4f4f4" onPress={this.onClose} style={styles.closeButton}>
            <Icon style={styles.closeButtonIcon} name="close" />
          </TouchableHighlight>


          <Animated.View style={[styles.okView, { opacity: this.state.okAnimation }]}>
            <Animated.View style={[styles.okWrap,
              { opacity: this.state.okAnimation, transform:[{ scale: this.state.okAnimation }] }
            ]}>
              <Icon name='done' style={styles.okSign} />
            </Animated.View>
            <View style={{ marginTop: 20 }}>
              <Text style={styles.okText}>Let's send your message...</Text>
            </View>
          </Animated.View>


          <Animated.View style={[styles.innerContainer, {opacity:this.state.formAnimation}]}>
          <KeyboardAvoidingView behavior={IOS ? 'position' : 'height'} keyboardVerticalOffset={IOS ? -100 : 30} style={styles.inputContainer}>
            <TextInput
              autoFocus={true}
              multiline={true}
              autoCapitalize={'sentences'}
              underlineColorAndroid={'transparent'}
              clearButtonMode={'while-editing'}
              returnKeyType={'send'}
              blurOnSubmit={true}
              onSubmitEditing={this.onSendText}
              style={styles.inputField}
              onChangeText={this.onChangeText}
              numberOfLines={3}
              maxLength={151}
              placeholderTextColor={'rgba(0,0,0, 0.2)'}
              placeholder="Say something..."
              autoCorrect={false}
              value={this.state.text} />

            <View style={styles.bottomButtons}>
              <SubmitButton
                onPress={this.onSendText}
                isDisabled={!this.state.text}
                isLoading={this.state.sendDone && !!this.state.text}
              >
                POST
              </SubmitButton>
            </View>
            </KeyboardAvoidingView>
          </Animated.View>
        </LinearGradient>
      </Modal>
    );
  }
}

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'center'
  },
  innerContainer: {
    padding: IOS ? 10 : 0,
    paddingBottom: 10,
    flex:1,
    justifyContent: 'center',
  },
  inputContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    flexGrow: 1,
  },
  bottomButtons:{
    flexDirection: 'row',
    alignItems: IOS ? 'stretch' : 'flex-end',
    justifyContent: IOS ? 'center' : 'flex-end',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    padding: 0,
    paddingBottom: 0,
    paddingHorizontal: IOS ? 15 : 30,
  },
  button: {
    borderRadius: 30,
    elevation: 2,
    marginBottom: IOS ? 0 : 20,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      height: 7,
      width: 0
    }
  },
  mainButton: {
    flex: 1,
    backgroundColor: theme.white,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: IOS ? 50 : 30,
    backgroundColor: 'transparent',
    width: 40,
    height: 40,
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  closeButtonIcon: {
    fontSize: 26,
    color: '#888',
  },
  cancelButton: {
    flex: 1,
    marginRight: 15,
    backgroundColor: '#aaa',
  },
  inputField: {
    fontSize: 18,
    lineHeight: 25,
    margin: 0,
    marginTop: IOS ? 110 : 0,
    color: theme.primary,
    textAlign: 'center',
    fontFamily: IOS ? 'Futurice' : 'Futurice_regular',
    height: 220,
    width: width - 60,
    left: 30,
  },
  okView: {
    position: 'absolute',
    top: IOS ? height / 2 - 170 : 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  okWrap:{
    position: 'relative',
    overflow: 'visible',
    paddingTop: 32,
    width: 140,
    height: 140,
    opacity: 0,
    transform: [{ scale: 0 }]
  },
  okSign:{
    fontSize: 105,
    color: theme.primary,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
  okText:{
    color: '#888',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'transparent',
    fontSize: 15
  }
});


const mapDispatchToProps = {
  closeTextActionView,
  postText
};


const select = store => ({
  isTextActionViewOpen: store.competition.get('isTextActionViewOpen')
})

export default connect(select, mapDispatchToProps)(TextActionView);
