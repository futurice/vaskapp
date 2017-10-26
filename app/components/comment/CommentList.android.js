
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
import CommentForm from './CommentForm';
import SimpleEmojiPicker from './SimpleEmojiPicker';

const { width, height } = Dimensions.get('window');


class CommentList extends Component {
  @autobind
  scrollBottom(animated = false) {
    if (this.commentScrollView){
      this.commentScrollView.scrollToEnd({ animated });
    }
  }

  @autobind
  postComment(comment) {
    this.props.postComment(comment);
    this.scrollBottom(true);
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
                <CommentPost item={postItem} openUserView={openUserView} />
                {comments.map((comment, index) => <Comment key={index} item={comment} openUserView={openUserView} />)}
              </ScrollView>
            }
          </View>

          <View style={styles.commentForm}>
            <CommentForm
              postComment={this.postComment}
              editComment={editComment}
              text={editCommentText}
              postCommentCallback={this.scrollBottom}
              loadingCommentPost={loadingCommentPost}
              onInputFocus={this.scrollBottom}
            />
          </View>
        </View>
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
});

export default CommentList;