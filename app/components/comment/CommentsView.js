import React, { PropTypes, Component } from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
  StyleSheet,
  Modal
} from 'react-native';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import {
  isCommentsViewOpen,
  isLoadingComments,
  isLoadingCommentPost,
  getCommentItem,
  getComments,
  getCommentEditText,
  editComment,
  postComment,
  closeComments
} from '../../concepts/comments';
import { openUserView } from '../../concepts/user';

import Text from '../common/MyText';
import theme from '../../style/theme';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CommentPost from './CommentPost';
import CommentList from './CommentList';
import Toolbar from '../common/Toolbar';
import UserView from '../user/UserView';

const IOS = Platform.OS === 'ios';

const { width, height } = Dimensions.get('window');

class CommentsView extends Component {
  @autobind
  onClose() {
    this.props.closeComments();
  }

  @autobind
  openUserView(user, avatar) {
    this.props.openUserView(user, avatar);
    this.props.navigator.push({ component: UserView, name: `${user.name}` });
  }

  render() {

    const {
      isCommentsViewOpen,
      commentItem,
      comments,
      postComment,
      editComment,
      editCommentText,
      loadingComments,
      loadingCommentPost,
    } = this.props;

    if (!isCommentsViewOpen) {
      return false;
    }


    return (
      <View style={styles.container}>
        {/*
        <View style={styles.header}>
          <TouchableOpacity onPress={this.onClose} style={styles.closeLink}>
            <Icon style={styles.closeLinkIcon} name="close" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Comment</Text>
        </View>
        */}
        <CommentList
          openUserView={this.openUserView}
          postItem={commentItem}
          comments={comments}
          postComment={postComment}
          editComment={editComment}
          editCommentText={editCommentText}
          loadingComments={loadingComments}
          loadingCommentPost={loadingCommentPost}
        />
      </View>
    );
  }
}

CommentsView.propTypes = {
  isCommentsViewOpen: PropTypes.bool,
  commentItem: PropTypes.object,
  comments: PropTypes.object,
  postComment: PropTypes.func,
  editComment: PropTypes.func,
  editCommentText: PropTypes.string,
  loadingComments: PropTypes.bool,
  loadingCommentPost: PropTypes.bool,
  isModal: PropTypes.bool,
};

CommentsView.defaultProps = {
  isCommentsViewOpen: false,
  loadingComments: false,
  loadingCommentPost: false,
  isModal: false,
}

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  header: {
    height: 56,
    backgroundColor: theme.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    paddingTop: 28,
    zIndex: 2,

    elevation: 10,
    shadowColor: theme.secondaryDark,
    shadowOpacity: 0.09,
    shadowRadius: 7,
    shadowOffset: {
      height: 5,
      width: 0
    },
  },
  headerTitle: {
    color: theme.primary,
    fontWeight: 'normal',
    top: IOS ? 3 : 0,
  },
  closeLink: {
    position: 'absolute',
    left: 0,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeLinkIcon: {
    top: 5,
    fontSize: 20,
    color: theme.dark
  }
});

const mapDispatchToProps = {
  editComment,
  postComment,
  closeComments,
  openUserView,
};

const select = createStructuredSelector({
  isCommentsViewOpen,
  commentItem: getCommentItem,
  comments: getComments,
  editCommentText: getCommentEditText,
  loadingComments: isLoadingComments,
  loadingCommentPost: isLoadingCommentPost
})

export default connect(select, mapDispatchToProps)(CommentsView);
