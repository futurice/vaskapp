
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
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import autobind from 'autobind-decorator';
import { isEmpty, noop } from 'lodash';
import PlatformTouchable from '../common/PlatformTouchable';
import AnimateMe from '../AnimateMe';

import Text from '../common/MyText';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';
import SimpleEmojiPicker from './SimpleEmojiPicker';

import permissions from '../../services/android-permissions';
import ImagePickerManager from 'react-native-image-picker';
import ImageCaptureOptions from '../../constants/ImageCaptureOptions';
import { isIphoneX } from '../../services/device-info';

const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

class CommentForm extends Component {
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

    if (!text) {
      Keyboard.dismiss();
    }

    if (!text || isEmpty(text.trim()) || loadingCommentPost) {
      return;
    }

    postComment({ text });
  }

  renderPostLoader() {
    return <ActivityIndicator style={styles.button} size={'small'} color={theme.primary} />;
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
        this.props.postComment({ imageData });
      }
    });
  }


  renderImageUpload() {
    return (
      <AnimateMe animationType="fade-in" duration={200}>
        <View style={styles.button}>
          <TouchableOpacity onPress={this.chooseImage} >
            <Text>
              <Icon name="photo-camera" style={[styles.buttonIcon, styles.secondaryIcon]} />
            </Text>
          </TouchableOpacity>
        </View>
      </AnimateMe>
    );
  }

  renderEmojiPickerToggle() {
    return (
      <AnimateMe animationType="fade-in" duration={200}>
        <View style={styles.button}>
          <TouchableOpacity onPress={this.props.toggleEmojiPicker}>
            <Text>
              <Icon name="sentiment-satisfied" style={[styles.buttonIcon, styles.secondaryIcon]} />
            </Text>
          </TouchableOpacity>
        </View>
      </AnimateMe>
    );
  }

  @autobind
  renderSubmit() {
    return (
      <AnimateMe animationType="fade-from-left" duration={250}>
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
    const { text, loadingCommentPost } = this.props;

    return (
      <View style={styles.itemWrapper}>

        <View style={styles.inputContainer}>
          <View style={{ position: 'relative', flexDirection: 'row', width: 52 }}>
            {this.renderEmojiPickerToggle()}
          </View>

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
            placeholder="Add comment..."
            onSubmitEditing={this.onSendText}
            onChangeText={this.onChangeText}
            value={text}
            onSelectionChange={this.props.setCursorPosition}
            onFocus={() => {
              // With android need additional input focus callback
              // To scroll to bottom of the list!
              !IOS && this.props.onInputFocus(true, 200)
            }}
          />

          <View style={styles.rightButtons}>
            {!text && !loadingCommentPost && this.renderImageUpload()}
            {!!text && !loadingCommentPost && this.renderSubmit()}
            {loadingCommentPost && this.renderPostLoader()}
          </View>
        </View>
      </View>
    );
  }
};

CommentForm.defaultProps = {
  onInputFocus: noop,
}


const styles = StyleSheet.create({
  itemWrapper: {
    width,
    height: isIphoneX ? 67 : 52,
    paddingBottom: isIphoneX ? 15 : 0,
    position: 'absolute',
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
    fontFamily: 'Futurice',
    color: theme.dark,
    height: 52,
    fontSize: 14,
    position: 'relative',
    borderRadius: 0,
    padding: 10,
    paddingLeft: 0,
    left: 0,
    width: width - (IOS ? 75 : 60),
  },
  rightButtons: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    flex: 1,
  },
  button: {
    zIndex: 1,
    position: 'relative',
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
  secondaryIcon: {
    color: theme.grey,
  },
});

export default CommentForm;
