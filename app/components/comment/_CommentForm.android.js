
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import autobind from 'autobind-decorator';
import { isEmpty } from 'lodash';
import PlatformTouchable from '../common/PlatformTouchable';
import AnimateMe from '../AnimateMe';

import Text from '../common/MyText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';

import permissions from '../../services/android-permissions';
import ImagePickerManager from 'react-native-image-picker';
import ImageCaptureOptions from '../../constants/ImageCaptureOptions';

const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

class CommentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    }
  }

  @autobind
  onChangeText(text) {
    this.props.editComment(text);
  }


  @autobind
  onSendText() {
    const {
      postComment,
      text,
      loadingCommentPost
    } = this.props;

    if (!text || isEmpty(text.trim()) || loadingCommentPost) {
      return;
    }

    postComment({ text });
  }

  renderPostLoader() {
    return <ActivityIndicator style={styles.button} size={'small'} color={theme.blue2} />;
  }

  @autobind
  chooseImage() {
    if (IOS) {
      this.openImagePicker();
    } else {
      permissions.requestCameraPermission(() => {
        setTimeout(() => {
          this.openImagePicker();
        });
      });
    }
  }

  @autobind
  openImagePicker() {
    ImagePickerManager.showImagePicker(ImageCaptureOptions, (response) => {
      if (!response.didCancel && !response.error) {
        const imageData = 'data:image/jpeg;base64,' + response.data;
        // text as '...'' because API does not yet approve comments without text
        this.props.postComment({ imageData, text: '...' });
      }
    });
  }


  renderImageUpload() {
    return (
      <AnimateMe animationType="fade-in" duration={200}>
        <View style={styles.button}>
          <TouchableOpacity onPress={this.chooseImage} >
            <Text>
              <Icon name="photo-camera" style={[styles.buttonIcon, styles.imageButtonIcon]} />
            </Text>
          </TouchableOpacity>
        </View>
      </AnimateMe>
    );
  }

  @autobind
  renderSubmit() {
    return (
      <AnimateMe animationType="fade-from-right" duration={250}>
        <View style={styles.button}>
          <TouchableOpacity onPress={this.onSendText} >
            <Text>
              <Icon name="send" style={styles.buttonIcon} />
            </Text>
          </TouchableOpacity>
        </View>
      </AnimateMe>
    )
  }

  render() {
    const { text, loadingCommentPost, onInputFocus } = this.props;

    return (
      <View style={styles.itemWrapper}>
        <KeyboardAvoidingView
          behavior={'height'}
          keyboardVerticalOffset={0}
          style={styles.inputContainer}
        >
          <TextInput
            autoFocus={false}
            autoCorrect={false}
            autoCapitalize={'sentences'}
            underlineColorAndroid={'transparent'}
            returnKeyType={'send'}
            style={styles.inputField}
            numberOfLines={1}
            blurOnSubmit={false}
            maxLength={151}
            placeholderTextColor={'rgba(0,0,0, 0.4)'}
            placeholder="Add comment...."
            onSubmitEditing={this.onSendText}
            onChangeText={this.onChangeText}
            value={text}
            onFocus={() => setTimeout(() => onInputFocus(true), 50)}
          />

          <View style={{ position: 'absolute', right: 0, flexDirection: 'row', flex: 1, }}>
            {!text && !loadingCommentPost && this.renderImageUpload()}
            {!!text && !loadingCommentPost && this.renderSubmit()}
            {loadingCommentPost && this.renderPostLoader()}
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
};


const styles = StyleSheet.create({
  itemWrapper: {
    width,
    height: 52,
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
  },
  inputContainer: {
    elevation: 1,
    borderTopColor: '#eee',
    borderTopWidth: 1,
    backgroundColor: theme.white,
    justifyContent: 'flex-start',
    flexGrow: 1,
    flex: 1,
    flexDirection: 'row',
    width,
  },
  inputField: {
    backgroundColor: theme.white,
    color: theme.dark,
    height: 52,
    fontSize: 14,
    position: 'relative',
    borderRadius: 0,
    padding: 10,
    left: 15,
    width: width - (IOS ? 75 : 60),
  },
  button: {
    zIndex: 1,
    position: 'relative',
    top: 0,
    right: 0,
    height: 52,
    width: 52,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.white,
  },
  buttonIcon: {
    backgroundColor: theme.transparent,
    color: theme.primary,
    fontSize: 25,
  },
  imageButtonIcon: {
    color: theme.grey,
  },
});

export default CommentForm;
