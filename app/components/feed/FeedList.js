'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  ListView,
  Animated,
  Easing,
  Text,
  RefreshControl,
  View,
  Dimensions,
  ScrollView,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import { noop, get } from 'lodash';
import { ImagePickerManager } from 'NativeModules';
import autobind from 'autobind-decorator';
import Icon from 'react-native-vector-icons/MaterialIcons';

import theme from '../../style/theme';
import { fetchFeed,
  refreshFeed,
  loadMoreItems,
  removeFeedItem,
  voteFeedItem,
} from '../../actions/feed';

import { openLightBox } from '../../concepts/lightbox';
import { openComments } from '../../concepts/comments';
import { openUserView } from '../../concepts/user';

import { openRegistrationView, getUserTeam, getUserName } from '../../concepts/registration';
import permissions from '../../services/android-permissions';

import EmptyState from './EmptyState';
import ImageEditor from './ImageEditor';
import FeedListItem from './FeedListItem';
import Notification from '../common/Notification';
import Loading from './Loading';
import ActionButtons from './ActionButtons';
import LoadingStates from '../../constants/LoadingStates';
import UserView from '../user/UserView';
import CommentsView from '../comment/CommentsView';

import ImageCaptureOptions from '../../constants/ImageCaptureOptions';
import {
  updateCooldowns,
  postImage,
  postAction,
  openTextActionView,
  openCheckInView,
  setEditableImage,
  clearEditableImage,
} from '../../concepts/competition';


import reactMixin from 'react-mixin';
import TimerMixin from 'react-timer-mixin';

const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.white,
  },
  feedContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
  },
  listView: {
    flex: 1,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  problemWrap: {
    flex: 1,
    top: height / 2 - 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  problemIcon: {
    fontSize: 100,
    color: '#ccc',
  },
  problemText: {
    marginTop: 20,
    color: '#ccc',
    fontSize: 20,
  }
});

class FeedList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actionButtonsAnimation: new Animated.Value(1),
      showScrollTopButton: false,
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 })
    };
  }

  componentDidMount() {
    this.props.fetchFeed();
    this.props.updateCooldowns();
  }

  componentWillReceiveProps({ feed }) {
    if (feed !== this.props.feed) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(feed.toJS())
      });
    }
    // Scroll to top when user does an action
    if (this.props.isSending){
      this.scrollTop();
    }
  }

  @autobind
  scrollTop() {
    if (this.refs._scrollView){
     this.refs._scrollView.scrollTo({x: 0, y: 0, animated: true});
    }
  }

  scrollPos: 0
  showActionButtons: true

  @autobind
  _onScroll(event) {

    const { onScrollDown, onScrollUp } = this.props;
    const { showScrollTopButton } = this.state;
    const SHOW_SCROLLTOP_LIMIT = 600;
    const HIDE_BUTTON_LIMIT = 570;
    const scrollTop = event.nativeEvent.contentOffset.y;

    const isOverLimit = scrollTop > SHOW_SCROLLTOP_LIMIT;
    const isOverHideLimit = scrollTop > HIDE_BUTTON_LIMIT;

    if (showScrollTopButton !== isOverLimit) {
      this.setState({ showScrollTopButton: isOverLimit });
    }

    const SENSITIVITY = 25;
    if (this.showActionButtons && isOverHideLimit && scrollTop - this.scrollPos > SENSITIVITY) {
      // Hide button
      this.showActionButtons = false;
      Animated.timing(this.state.actionButtonsAnimation, { toValue: 0, duration: 300 }).start();
      onScrollDown();
    } else if (
      !this.showActionButtons &&
      ((isOverHideLimit && this.scrollPos - scrollTop > SENSITIVITY) || !isOverHideLimit)
    ) {
      // Show button
      this.showActionButtons = true;
      Animated.timing(this.state.actionButtonsAnimation, { toValue: 1, duration: 300 }).start();
      onScrollUp();
    }

    this.scrollPos = scrollTop;

  }

  @autobind
  onRefreshFeed() {
    this.props.refreshFeed();
  }

  @autobind
  onLoadMoreItems() {
    const { isRefreshing, feed } = this.props;
    if (isRefreshing || !feed.size || feed.size < 10) {
      return;
    }

    const oldestItem = feed
      // admin items are not calclulated
      .filter(item => item.getIn(['author','type']) !== 'SYSTEM')
      // get oldest by createdAt
      .minBy(item => item.get('createdAt'));

    const oldestItemID = oldestItem.get('id', '');

    if (oldestItemID) {
      this.props.loadMoreItems(oldestItemID);
    }
  }

  @autobind
  openUserView(user, avatar) {
    this.props.openUserView(user, avatar);
    this.props.navigator.push({ component: UserView, name: `${user.name}`, showName: true });
  }

  @autobind
  openPostComments(postId) {
    this.props.openComments(postId);
    this.props.navigator.push({ component: CommentsView, name: 'Comment', showName: true });
  }


  @autobind
  chooseImage(openLibrary) {
    if (IOS) {
      this.openImagePicker(openLibrary);
    } else {
      permissions.requestCameraPermission(() => {
        setTimeout(() => {
          this.openImagePicker(openLibrary);
        });
      });
    }
  }

  @autobind
  openImagePicker(openLibrary) {
    const imagePickFunctionality = openLibrary ? 'launchImageLibrary' : 'launchCamera';

    ImagePickerManager[imagePickFunctionality](ImageCaptureOptions, (response) => {
      if (!response.didCancel && !response.error) {
        const data = 'data:image/jpeg;base64,' + response.data;
        const editableImage = {
          data,
          width: response.width,
          height: response.height,
          vertical: response.isVertical
        };

        this.openImageEditor(editableImage);
      }
    });
  }

  @autobind
  openImageEditor(editableImage) {
    this.props.setEditableImage(editableImage);
  }

  @autobind
  onImagePost(postPayload) {
    // postPayload: { image, text, imageText, imageTextPosition, addLocation }
    this.props.postImage(postPayload);
    this.resetPostImage();
  }

  @autobind
  resetPostImage() {
    this.props.clearEditableImage();
  }

  @autobind
  onPressAction(type, subType) {

    switch (type) {
      case 'IMAGE':
        return this.chooseImage(subType === 'library');
      case 'TEXT':
        return this.props.openTextActionView();
      case 'CHECK_IN_EVENT': {
        return this.props.openCheckInView();
      }
      default:
        return this.props.postAction(type);
    }
  }

  renderSkeletonState() {
    const item = { type: 'SKELETON' };
    return (
    <View style={styles.feedContainer}>
      <View style={styles.listView}>
        <FeedListItem item={item} />
        <FeedListItem item={item} opacity={0.75} />
        <FeedListItem item={item} opacity={0.5} />
      </View>
    </View>);
  }

  @autobind
  renderFeed(feedListState, isLoadingActionTypes, isLoadingUserData) {
    const refreshControl = <RefreshControl
      refreshing={this.props.isRefreshing || this.props.isSending}
      onRefresh={this.onRefreshFeed}
      colors={[theme.secondary]}
      tintColor={theme.secondary}
      progressBackgroundColor={theme.light} />;

    const isLoading = isLoadingActionTypes || isLoadingUserData;
    const { dataSource } = this.state;

    switch (feedListState) {
      case LoadingStates.LOADING:
        return this.renderSkeletonState();
      case LoadingStates.FAILED:
        return (
          <ScrollView style={{ flex: 1 }} refreshControl={refreshControl}>
            <View style={styles.problemWrap}>
              <Icon style={styles.problemIcon} name="hot-tub" />
              <Text style={styles.problemText}>Could not get feed, pull to refresh...</Text>
            </View>
          </ScrollView>
        );
      default:
        return (
          <View style={styles.feedContainer}>
            <ListView
              ref='_scrollView'
              dataSource={dataSource}
              showsVerticalScrollIndicator={false}
              renderRow={item => <FeedListItem
                item={item}
                key={item.id}
                userTeam={this.props.userTeam}
                removeFeedItem={this.props.removeFeedItem}
                voteFeedItem={this.props.voteFeedItem}
                openRegistrationView={this.props.openRegistrationView}
                openUserView={this.openUserView}
                openComments={this.openPostComments}
                openLightBox={this.props.openLightBox} />
              }
              style={[styles.listView]}
              onScroll={this._onScroll}
              onEndReached={this.onLoadMoreItems}
              refreshControl={refreshControl} />
            {!dataSource.length && <EmptyState />}
            <ActionButtons
              visibilityAnimation={this.state.actionButtonsAnimation}
              isRegistrationInfoValid={this.props.isRegistrationInfoValid}
              style={styles.actionButtons}
              isLoading={isLoading}
              onPressAction={this.onPressAction}
              onScrollTop={this.scrollTop}
              showScrollTopButton={this.state.showScrollTopButton}
              />
          </View>
        );
    }
  }

  render() {

    return (
      <View style={styles.container}>
        {this.renderFeed(
          this.props.feedListState,
          this.props.isLoadingActionTypes,
          this.props.isLoadingUserData
        )}
        <Notification visible={this.props.isNotificationVisible}>
          {this.props.notificationText}
        </Notification>
        <ImageEditor
          onCancel={this.resetPostImage}
          onImagePost={this.onImagePost}
          animationType={'fade'}
          image={this.props.editableImage}
        />
      </View>
    );
  }
}

FeedList.defaultProps = {
  onScrollUp: noop,
  onScrollDown: noop,
};


const mapDispatchToProps = {
  fetchFeed,
  refreshFeed,
  loadMoreItems,
  updateCooldowns,
  postImage,
  postAction,
  openTextActionView,
  removeFeedItem,
  voteFeedItem,
  openCheckInView,
  openLightBox,
  setEditableImage,
  clearEditableImage,
  openComments,
  openRegistrationView,
  openUserView,
};

const select = store => {
  const userTeam =  getUserTeam(store);
  const userName = getUserName(store);
  const isRegistrationInfoValid = !!userName;

  return {
    feed: store.feed.get('list'),
    feedListState: store.feed.get('listState'),
    isRefreshing: store.feed.get('isRefreshing'),
    isLoadingActionTypes: store.competition.get('isLoadingActionTypes'),
    actionTypes: store.competition.get('actionTypes'),
    isNotificationVisible: store.competition.get('isNotificationVisible'),
    notificationText: store.competition.get('notificationText'),
    isSending: store.competition.get('isSending'),
    userTeam,
    editableImage: store.competition.get('editableImage'),

    isRegistrationInfoValid,
    isLoadingUserData: store.registration.get('isLoading'),
  };
};

reactMixin(FeedList.prototype, TimerMixin);
export default connect(select, mapDispatchToProps)(FeedList);
