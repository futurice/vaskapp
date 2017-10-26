
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
      cursorPositionStart: null,
      cursorPositionEnd: null,
    }
  }


  @autobind
  onAddCustomText(customChar) {
    const { editCommentText } = this.props;
    const { cursorPositionStart, cursorPositionEnd } = this.state;

    // if there is existing value from last edit, and user has not focused input
    const start = editCommentText && cursorPositionStart > editCommentText.length
      ? 0
      : cursorPositionStart;

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
  setCursorPosition({ selection }) {
    const { start, end } = selection;
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
      <KeyboardAvoidingView
        behavior={IOS ? 'position' : 'position'}
        keyboardVerticalOffset={IOS ? 0 : 300}
        style={styles.commentList}
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
            <View style={{ zIndex: 20, position: 'absolute', left: 0, bottom: 50, width: 50, flex: 1 }}>
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
    paddingBottom: 52,
    minHeight: height - 56,
    maxHeight: height - 56,
    flexGrow: 1,
    backgroundColor: theme.white,
    justifyContent: 'space-between',
  },
  commentScroll: {
    // flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    flexGrow: 1,
    backgroundColor: theme.white,
    minHeight: height - 107,
    paddingBottom: IOS ? 0 : 20,
  },
  commentForm: {
    height: 52,
    position: 'relative',
    left: 0,
    right: 0,
    bottom: IOS ? 0 : 25,
  },


  // # <Comment />
  comment:{
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: IOS ? 25 : 20,
    paddingBottom: 10,
    paddingTop: 15,
  },
  commentContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  commentAvatarCol: {
    paddingRight: 18,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.earth1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18
  },
  commentAvatarIcon: {
    top: 0,
    left: 0,
    textAlign: 'center',
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: theme.earth1,
    borderRadius: 18,
    color: theme.white,
    fontSize: 36,
    lineHeight: 44,
    backgroundColor: theme.transparent
  },
  commentText: {
    textAlign: 'left',
    color: theme.primary
  },
  commentListItemImg: {
    width: width,
    height: width,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  commentTextContent:{
    flex: 1,
  },
  authorField: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 7,
  },
  commentAuthor: {
    color: theme.primary,
    fontWeight: 'bold',
  },
  itemTimestamp: {
    marginLeft: 10,
    top: 2,
    flex: 1,
    color: '#aaa',
    fontSize: 12,
    fontWeight: 'normal'
  },
});

export default CommentList;