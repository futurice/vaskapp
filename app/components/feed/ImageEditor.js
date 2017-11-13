'use strict';

import React, { Component } from 'react';
import {
  Modal,
  View,
  Image,
  StyleSheet,
  Platform,
  Text,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  ScrollView,
  BackHandler,
  KeyboardAvoidingView,
  PanResponder
} from 'react-native';
import autobind from 'autobind-decorator';
import Icon from 'react-native-vector-icons/MaterialIcons';

import theme from '../../style/theme';
import Fab from '../common/Fab';
import Toolbar from '../common/Toolbar';
import ScrollHeader from '../common/ScrollHeader';
import PostSettings from './PostSettings';
import * as features from '../../constants/Features';

const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

const inputHeight = 40;

class ImageEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showTextInput: false,
      textInputValue: '',
      imagePos: 0,
      editing: false,
      locationToPost: true,
    };
  }

  _panResponder = {};

  componentWillMount() {
    this._panResponder = PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true, // Math.abs(gestureState.dx) > 5,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onShouldBlockNativeResponder: (evt, gestureState) => true,
      onPanResponderTerminationRequest: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        this.moveTextInput(gestureState.y0);
      },
      onPanResponderMove: (e, gestureState) => {
        this.moveTextInput(gestureState.moveY);
      },
    });
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.state.editing) {
        this.setState({ editing: false });
        return true;
      }
      return false;
    })
  }

  componentWillReceiveProps({ image }) {
    if (image && !this.props.image) {
      // new image arrived
      this.centerImageText({image});
      this.setState({ showTextInput: false });
    } else if (!image && this.props.image) {
      // image removed and editorview hidden
    }
  }

  @autobind
  moveTextInput(touchPosition) {
    const { image } = this.props;
    const { editing } = this.state;

    // Disable dragging while editing
    if (editing) {
      return false;
    }

    const imagePosY = this.state.imagePos.pageY;
    const scaledImageHeight = image ? width * (image.height / image.width) : 0;

    const calculatedNewPos = touchPosition - imagePosY - 20;
    const newPos = Math.min(
          scaledImageHeight - inputHeight, // upper limit
          Math.max(0, calculatedNewPos)
          )

    this.setState({ textPosition: newPos });
  }

  @autobind
  togglePostLocationStatus(locationToPost) {
    this.setState({ locationToPost })
  }

  @autobind
  centerImageText(props) {
    const { image } = props || this.props;
    const scaledImageHeight = image ? width * (image.height / image.width) : 0;
    const centerTextPos = scaledImageHeight / 2 - inputHeight / 2;
    this.setState({ textPosition: centerTextPos });
  }

  @autobind
  showTextInput() {
    this.setState({ showTextInput: true, editing: true });
  }

  @autobind
  sendImage() {
    const { onImagePost, image } = this.props;
    const { locationToPost } = this.state;
    const { textInputValue, textPosition } = this.state;
    const scaledImageHeight = image ? width * (image.height / image.width) : 0;

    // If caption is on bottom
    const onBottom = scaledImageHeight - (textPosition + inputHeight) === 0;

    const imageTextPosition = onBottom ? 1 : textPosition / scaledImageHeight;

    onImagePost({
      image: image.data,
      text: textInputValue,
      textPosition: imageTextPosition,
      addLocation: locationToPost,
    });

    // TODO Success/Loading indicator
    this.clearTextInput();
  }

  @autobind
  getImagePosition(){
    const view = this.refs.editImgRef;
    if (!view) {
      return;
    }

    view.measure((x, y, w, h, pageX, pageY) => {
      this.setState({
        imagePos: { x, y, w, h, pageY }
      });
    });
  }

  @autobind
  clearTextInput() {
    this.onChangeText('');
  }

  @autobind
  onChangeText(textInputValue) {
    this.setState({ textInputValue });
  }

  @autobind
  renderGuideLayer(imgHeight) {
    const visibleHeight = Math.min(imgHeight, height - 100);
    return (
      <TouchableOpacity style={[styles.tapGuide, { top: visibleHeight / 2 - 25 }]} onPress={this.showTextInput} >
        <Text style={styles.tapGuideText}>ADD CAPTION</Text>
      </TouchableOpacity>
    );
  }

  @autobind
  renderTextInput(imgHeight) {
    const { editing, textPosition } = this.state;
    return (

      <View
        {...this._panResponder.panHandlers}
        style={{
          top: editing ? 0 : textPosition,
          position: 'absolute',
          left: 0,
          right: 0,
          zIndex: 12,
          backgroundColor: theme.secondaryLayer,
          width,
          height: inputHeight
      }}>
        <KeyboardAvoidingView
          behavior={'height'}
          keyboardVerticalOffset={0}
          style={{flex: 1}}
        >
        <View style={{
          height: inputHeight,
          width,
          flex: 1,
          backgroundColor: theme.transparent
        }}>
        {!editing
        ?
        <TouchableOpacity onPress={() => this.setState({ editing: true })} activeOpacity={1} style={styles.inputFieldWrap}>
          <Text style={styles.inputFieldText}>{this.state.textInputValue}</Text>
        </TouchableOpacity>
        :
        <TextInput
          ref={'imageCaptionInput'}
          autoFocus={true}
          multiline={false}
          underlineColorAndroid={'transparent'}
          clearButtonMode={'never'}
          returnKeyType={'done'}
          blurOnSubmit={true}
          onSubmitEditing={() => this.setState({ editing: false })}
          onEndEditing={() => this.setState({ editing: false })}
          onFocus={() => this.setState({ editing: true })}
          onBlur={() => this.setState({ editing: false })}
          style={styles.inputField}
          onChangeText={this.onChangeText}
          numberOfLines={1}
          maxLength={36}
          placeholderTextColor={theme.blue2}
          placeholder={''}
          value={this.state.textInputValue}
        />
        }

      </View>
      </KeyboardAvoidingView>
      </View>
      )
  }

  @autobind
  renderEditButton(imgHeight) {
    const { textPosition } = this.state;

    return (
      <View
        style={{
          top: textPosition,
          position: 'absolute',
          left: 0,
          zIndex: 12,
          backgroundColor: theme.transparent,
          width: inputHeight,
          height: inputHeight
      }}>
        <TouchableOpacity
          onPress={() => this.setState({ editing: true })}
          activeOpacity={1}
          style={{ flex: 1 }}
        >
          <Text style={[styles.inputFieldText, styles.editButton]}>
            <Icon name="create" size={24}/>
          </Text>
        </TouchableOpacity>
      </View>
      )
  }

  @autobind
  renderSubmitButtonForAndroid() {
    return (
      <Fab
        onPress={this.sendImage}
        styles={styles.button}
        underlayColor={theme.secondaryDark}
      >
        <Text style={styles.buttonText}>
          <Icon size={34} name="done" />
        </Text>
      </Fab>
    );
  }

  @autobind
  onImageEditCancel() {
    const { onCancel } = this.props;

    onCancel();
    this.clearTextInput();
  }


  render() {

    const { image } = this.props;
    const { showTextInput, editing } = this.state;

    const { OVER_IMAGE_CAPTION } = features;
    const scaledImageHeight = image ? width * (image.height / image.width) : 0;
    const scaledImageHeightStyle = { height: scaledImageHeight };


    return (
      <Modal
        visible={!!image}
        animationType={'fade'}
        onRequestClose={this.onImageEditCancel}
      >
      {image &&
      <View style={{ flex: 1 }}>

        {IOS
        ? <Toolbar
          leftIcon={'close'}
          rightText={'Post'}
          rightIcon={'done'}
          rightIconClick={this.sendImage}
          leftIconClick={this.onImageEditCancel}
          title='Photo'
          styles={{ elevation: 0 }}
        />
        : <ScrollHeader
            icon="close"
            onIconClick={this.onImageEditCancel}
            title="Photo"
          />
      }
        <View style={styles.container}>

          <PostSettings
            onChangeImageText={this.onChangeText}
            imageText={this.state.textInputValue}

            postLocationStatus={this.state.locationToPost}
            togglePostLocationStatus={this.togglePostLocationStatus}
          />

          <View style={{ flex: 1, }}>
            <ScrollView>
              <View style={[styles.imageWrap, scaledImageHeightStyle]}>
                <View
                  style={[styles.imageWrap, styles.imageWrapper, scaledImageHeightStyle]}
                  onLayout={this.getImagePosition}
                >
                  <Image
                    ref="editImgRef"
                    style={[
                      styles.image,
                      scaledImageHeightStyle
                    ]}
                    resizeMode={'contain'}
                    source={{ uri: image.data }}
                  />
                </View>
                {OVER_IMAGE_CAPTION && showTextInput && this.renderTextInput(scaledImageHeight)}
              </View>
            </ScrollView>
          </View>
          {OVER_IMAGE_CAPTION && !showTextInput && this.renderGuideLayer(scaledImageHeight)}
          {OVER_IMAGE_CAPTION && showTextInput && !editing && this.renderEditButton(scaledImageHeight)}
        </View>
        {!IOS && this.renderSubmitButtonForAndroid()}
      </View>
      }
      </Modal>
    );
  }
};



const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.stable,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  imageWrap: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  imageWrapper: {
    backgroundColor: theme.stable,
    width: width,

    elevation: 2,
    shadowColor: theme.secondaryDark,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {
      height: 6,
      width: 0
    },
  },
  image: {
    backgroundColor: theme.white,
    width
  },
  tapGuide: {
    position: 'absolute',
    width: 150,
    height: 50,
    top: 0,
    left: width / 2 - 75,
    backgroundColor: theme.secondaryLayer,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    zIndex: 3,
  },
  tapGuideText: {
    color: theme.blue2,
    fontWeight: 'bold',
  },
  inputFieldWrap: {
    height: inputHeight,
    margin: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    top: IOS ? 0 : -1,
    left: 0,
    width,
    zIndex: 9,
    backgroundColor: theme.transparent,
  },
  inputFieldText: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.transparent,
    fontSize: 17,
    color: theme.blue2,
    textAlign: 'center',
    lineHeight: IOS ? inputHeight - 2 : null,
  },
  inputField: {
    position: 'absolute',
    top: IOS ? 0 : 1.5,
    left: 0,
    fontSize: 17,
    color: theme.blue2,
    textAlign: 'center',
    height: inputHeight,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width,
    zIndex: 9,
  },
  editButton: {
    color: 'rgba(0,0,0,.4)',
    paddingTop: IOS ? 8 : 7,
    paddingLeft: 6,
    lineHeight: null,
    fontSize: 26,
  },
  buttonWrap: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 70,
    width: 70,
    zIndex: 9,
  },
  button: {
    backgroundColor: theme.secondary,
    height: 66,
    width: 66,
    borderRadius: 33,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    backgroundColor: 'transparent',
    fontSize: 25,
    fontWeight: 'bold',
    color: theme.white
  },
});


export default ImageEditor;
