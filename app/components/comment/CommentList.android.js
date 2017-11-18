
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  Dimensions
} from 'react-native';

import { fromJS } from 'immutable';
import moment from 'moment';
import autobind from 'autobind-decorator';

import ParsedText from 'react-native-parsed-text';
import Text from '../common/MyText';
import theme from '../../style/theme';
import time from '../../utils/time';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ICONS from '../../constants/Icons';
import { Comment, CommentPost } from './CommentPost';
import CommentImageZoom from './CommentImageZoom';
import CommentForm from './CommentForm';
import SimpleEmojiPicker from './SimpleEmojiPicker';

const { width, height } = Dimensions.get('window');

const insertText = (str, index, indexEnd, value) =>
  str.substr(0, index) + value + str.substr(index + (indexEnd - index));

class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEmojiPicker: false,
      cursorPositionStart: 0,
      cursorPositionEnd: 0,
      zoomedImage: null,
    }
  }

  @autobind
  onAddCustomText(customChar) {
    const { editCommentText } = this.props;
    const { cursorPositionStart, cursorPositionEnd } = this.state;

    // if there is existing value from last edit, and user has not focused input
    const start = editCommentText && cursorPositionStart > editCommentText.length ? 0 : cursorPositionStart;

    const newText = insertText(editCommentText || '', start, cursorPositionEnd, customChar);
    this.props.editComment(newText);
  }

  @autobind
  toggleEmojiPicker() {
    this.setState({ showEmojiPicker: !this.state.showEmojiPicker })
  }

  @autobind
  closeEmojiPicker() {
    this.setState({ showEmojiPicker: false })
  }

  @autobind
  setCursorPosition({ nativeEvent: { selection: { start, end } } }) {
    this.setState({
      cursorPositionStart: start,
      cursorPositionEnd: end,
    })
  }

  @autobind
  scrollBottom(animated = false, timeout = 0) {
    if (this.commentScrollView){
      setTimeout(() => {
        this.commentScrollView.scrollToEnd({ animated });
      }, timeout);
    }
  }

  @autobind
  postComment(comment) {
    this.props.postComment(comment);
    this.closeEmojiPicker();
    this.scrollBottom(true);
  }

  @autobind
  zoomImage(zoomedImage) {
    this.setState({ zoomedImage })
  }

  @autobind
  resetZoomImage() {
    this.setState({ zoomedImage: null })
  }

  renderLoader() {
    return <ActivityIndicator size="large" color={theme.blue1} />;
  }

  render() {
    const {
      postItem,
      comments,
      postComment,
      editComment,
      editCommentText,
      loadingComments,
      loadingCommentPost,
      openUserView,
    } = this.props;

    return (
      <View style={styles.commentList}>
        <View style={styles.commentView}>
          <View style={styles.commentScroll}>
            {loadingComments
              ? this.renderLoader()
              :
              <ScrollView
                keyboardShouldPersistTaps={'handled'}
                ref={ref => this.commentScrollView = ref}
                onContentSizeChange={(contentWidth, contentHeight) => {
                  this.scrollBottom(false);
                }}
              >
                <CommentPost item={postItem} openUserView={openUserView} onImagePress={this.zoomImage} />
                {comments.map((comment, index) =>
                  <Comment key={index} item={comment} openUserView={openUserView} onImagePress={this.zoomImage} />)}
              </ScrollView>
            }
          </View>

          {this.state.showEmojiPicker &&
            <View style={styles.emojiPicker}>
              <SimpleEmojiPicker onEmojiPress={this.onAddCustomText} />
            </View>
          }

          <View style={styles.commentForm}>
            <CommentForm
              toggleEmojiPicker={this.toggleEmojiPicker}
              setCursorPosition={this.setCursorPosition}

              postComment={this.postComment}
              editComment={editComment}
              text={editCommentText}
              postCommentCallback={this.scrollBottom}
              loadingCommentPost={loadingCommentPost}
              onInputFocus={this.scrollBottom}
            />
          </View>
        </View>
        <CommentImageZoom
          imageUrl={this.state.zoomedImage}
          onClose={this.resetZoomImage}
        />

      </View>
    )
  }
}


const styles = StyleSheet.create({

  // # <CommentList />
  commentList: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: theme.white,
  },
  commentView: {
    paddingBottom: 28,
    // height: height,
    // justifyContent: 'space-between',
    flexDirection: 'column',
    backgroundColor: theme.white,
    flexGrow: 1,
    flex: 1,
  },
  commentScroll: {
    // flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    flexGrow: 1,
    backgroundColor: theme.white,
    // minHeight: height - 135,
    paddingBottom: 20,
  },
  commentForm: {
    height: 52,
    position: 'absolute',
    zIndex: 99,
    left: 0,
    right: 0,
    bottom: 0,
  },
  emojiPicker: {
    zIndex: 20,
    position: 'absolute',
    left: 0,
    bottom: 50,
    width: 54,
    minHeight: 260,
    flex: 0,
  },
});

export default CommentList;