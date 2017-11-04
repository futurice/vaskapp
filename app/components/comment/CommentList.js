
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
  Linking,
} from 'react-native';
import { fromJS } from 'immutable';
import moment from 'moment';
import autobind from 'autobind-decorator';

import ParsedText from 'react-native-parsed-text';
import Text from '../common/MyText';
import theme from '../../style/theme';
import time from '../../utils/time';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Comment, CommentPost } from './CommentPost';
import CommentForm from './CommentForm';
import SimpleEmojiPicker from './SimpleEmojiPicker';

const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

const insertText = (str, index, indexEnd, value) =>
  str.substr(0, index) + value + str.substr(index + (indexEnd - index));


class CommentList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showEmojiPicker: false,
      cursorPositionStart: 0,
      cursorPositionEnd: 0,
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
  scrollBottom(animated = false) {
    if (this.commentScrollView){
     this.commentScrollView.scrollToEnd({ animated });
    }
  }

  @autobind
  postComment(comment) {
    this.props.postComment(comment);

    this.closeEmojiPicker();
    this.scrollBottom(true);
  }

  renderLoader() {
    return <ActivityIndicator size="large" color={theme.primary} />;
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
        <KeyboardAvoidingView
          style={{ flexGrow: 1 }}
          contentContainerStyle={{ flexGrow: 1  }}
          behavior={IOS ? 'position' : 'position'}
          keyboardVerticalOffset={IOS ? 60 : 300}
        >
        <View style={styles.commentView}>
          <View style={styles.commentScroll}>
            {loadingComments
              ? this.renderLoader()
              :
              <ScrollView
                ref={ref => this.commentScrollView = ref}
                onContentSizeChange={(contentWidth, contentHeight) => {
                  this.scrollBottom(false);
                }}
                keyboardShouldPersistTaps="always"
              >
                <CommentPost item={postItem} openUserView={openUserView} />
                {comments.map((comment, index) => <Comment key={index} item={comment} openUserView={openUserView} />)}
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
            />
          </View>
        </View>
        </KeyboardAvoidingView>
      </View>
    )
  }
}


const styles = StyleSheet.create({

  // # <CommentList />
  commentList: {
    // flex: 1,
    flexGrow: 1,
    backgroundColor: theme.white,
  },
  commentView: {
    // minHeight: height - 40,
    // maxHeight: height - 40,
    // flex: 1,
    // justifyContent: 'space-between',
    flexGrow: 1,
    backgroundColor: theme.white,
  },
  commentScroll: {
    // flex: 1,
    // flexGrow: 1,
    // minHeight: height - 107,
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: theme.white,
    paddingBottom: IOS ? 0 : 20,
  },
  commentForm: {
    height: 52,
    position: 'relative',
    left: 0,
    right: 0,
    bottom: IOS ? 0 : 25,
  },

  emojiPicker: {
    zIndex: 20,
    position: 'absolute',
    left: 0,
    bottom: 50,
    width: 50,
    flex: 1,
  },
});

export default CommentList;