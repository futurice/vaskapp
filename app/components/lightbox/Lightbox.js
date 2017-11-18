'use strict';
import React, { Component } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  BackHandler,
  Modal,
  ScrollView,
  CameraRoll,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import PhotoView from 'react-native-photo-view';
import ImageZoom from 'react-native-image-zoom';
import Share from 'react-native-share';
import autobind from 'autobind-decorator';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import ModalBox from 'react-native-modalbox';

import { openComments } from '../../concepts/comments';
import { openRegistrationView } from '../../concepts/registration';
import { voteFeedItem, removeFeedItem } from '../../actions/feed';
import { getLightboxItem, closeLightBox, isLightBoxOpen } from '../../concepts/lightbox';
import abuse from '../../services/abuse';
import { isIphoneX } from '../../services/device-info';

import PlatformTouchable from '../common/PlatformTouchable';
import ModalBackgroundView from '../common/ModalBackgroundView';
import Text from '../common/MyText';
import Loader from '../common/Loader';
import CommentsView from '../comment/CommentsView';
import CommentsLink from '../feed/CommentsLink';
import VotePanel from '../feed/VotePanel';
import theme from '../../style/theme';

const IOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');
const DISMISS_SCROLL_DISTANCE = 100;

class LightBox extends Component {


  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.props.isLightBoxOpen) {
        this.onClose()
        return true;
      }
      return false;
    });
  }

  componentWillReceiveProps({ isLightBoxOpen }) {
    if (isLightBoxOpen && !this.props.isLightBoxOpen) {
      // reset lightbox on start
      this.setState({ loading: true });
    }
  }

  @autobind
  openPostComments() {
    const { lightBoxItem } = this.props;
    const postId = lightBoxItem.get('id');

    this.onClose();
    this.props.openComments(postId);
    this.props.navigator.push({ component: CommentsView, name: 'Comments', showName: true });
  }


  @autobind
  onClose() {
    this.props.closeLightBox();
  }

  onShare(imgUrl) {
    const title = 'Vask';
    if (!IOS) {
      const shareOptions = { title, url: imgUrl };
      Share.open(shareOptions);
      return;
    }

    // HOX Android CameraRoll cannot access to url directly
    // https://medium.com/react-native-training/mastering-the-camera-roll-in-react-native-13b3b1963a2d
    CameraRoll.saveToCameraRoll(imgUrl)
    .then(localImagePath => {
      const shareOptions = { title, url: localImagePath };
      Share.open(shareOptions);
    });
  }

  itemIsCreatedByMe(item) {
    return item.getIn(['author','type'],'') === 'ME';
  }

  @autobind
  onScrollEnd(event) {
    const scrollTop = event.nativeEvent.contentOffset.y;
    const scrollDistance = Math.abs(scrollTop);
    const isOverLimit = scrollDistance > DISMISS_SCROLL_DISTANCE;
    if (isOverLimit) {
      // this.onClose();
    } else {
      this.scrollTop();
    }
  }

  @autobind
  onScroll(event) {
    const scrollTop = event.nativeEvent.contentOffset.y;
    const scrollDistance = Math.abs(scrollTop);
    const isOverLimit = scrollDistance > DISMISS_SCROLL_DISTANCE;
    if (isOverLimit) {
      this.onClose();
    }
  }



  @autobind
  scrollTop() {
    if (this.refs._modalScroll){
     this.refs._modalScroll.scrollTo({x: 0, y: 0, animated: true});
    }
  }

  showRemoveDialog(item) {
    if (this.itemIsCreatedByMe(item)) {
      Alert.alert(
        'Remove Content',
        'Do you want to remove this item?',
        [
          { text: 'Cancel',
            onPress: () => { }, style: 'cancel' },
          { text: 'Yes, remove item',
            onPress: () => { this.removeThisItem(item); }, style: 'destructive' }
        ]
      );
    } else {
      Alert.alert(
        'Flag Content',
        'Do you want to report this item?',
        [
          { text: 'Cancel',
            onPress: () =>  {  console.log('Cancel Pressed'); }, style: 'cancel' },
          { text: 'Yes, report item',
            onPress: () =>  {  abuse.reportFeedItem(item.toJS()); }, style: 'destructive' }
        ]
      );
    }
  }

  removeThisItem(item) {
    this.props.removeFeedItem(item.toJS());
    this.onClose();
  }

  render() {

    const {
      isLightBoxOpen,
      lightBoxItem
    } = this.props;

    if (!isLightBoxOpen || !lightBoxItem) {
      return null
    }

    const itemImage = lightBoxItem.get('url');
    const itemAuthor = lightBoxItem.getIn(['author', 'name']);
    const isSystemUser = lightBoxItem.getIn(['author', 'type'], '') === 'SYSTEM';
    const created = moment(lightBoxItem.get('createdAt', ''));
    const itemText = lightBoxItem.get('text');

    return (
      <Modal
        onRequestClose={this.onClose}
        visible={isLightBoxOpen}
        backButtonClose={true}
        style={styles.modal}
        transparent={true}
        supportedOrientations={['portrait']}
        animationType={IOS ? 'slide' : 'slide'}

        // ModalBox
        // isOpen={isLightBoxOpen}
        // backdropPressToClose={true}
        // backButtonClose={true}
        // onClosed={this.onClose}
        // swipeToClose={false}
        // backdrop={false}

      >
        <ScrollView
          scrollEventThrottle={5}
          ref="_modalScroll"
          onScroll={this.onScroll}
          onScrollEndDrag={this.onScrollEnd}
          decelerationRate={0}
          contentContainerStyle={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
        >
        <ModalBackgroundView style={styles.container} blurType="light" >
          {IOS
          ?
          <View style={{ width, height }}>
            <PhotoView
              source={{uri: itemImage}}
              minimumZoomScale={1}
              maximumZoomScale={4}
              resizeMode={'contain'}
              style={{ width, height: width }} />
          </View>
          : <View style={{ justifyContent: 'center', width, height }}>
            <ImageZoom
              onLoad={() => {
                this.setState({ loading: false });
              }}
              source={{ uri: itemImage }}
              resizeMode={'contain'}
              style={{ width, height: width, flex: 1 }}
            />
            {this.state.loading &&
            <View style={{position: 'absolute', left: width / 2 - 25, top: height / 2 - 25, alignItems: 'center', justifyContent: 'center', width: 50, height: 50}}>
              <Loader color={theme.secondary} size='large' />
            </View>
            }
          </View>
          }
          <View style={styles.header}>
            <View style={styles.header__icon}>
              <PlatformTouchable delayPressIn={0} onPress={this.onClose}>
                <View><Icon style={{ color: theme.primary, fontSize: 26 }} name="close" /></View>
              </PlatformTouchable>

              <View style={styles.headerTitle}>
              {itemAuthor &&
                <Text style={styles.headerTitleText}>{!isSystemUser ? itemAuthor : 'Vask'}</Text>
              }
                <View style={styles.date}>
                  <Text style={styles.dateText}>
                    {created.format('ddd DD.MM.YYYY')} at {created.format('HH:mm')}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.toolbar}>
            {!!itemText &&
            <View>
              <Text style={styles.imageCaptionText}>{itemText}</Text>
            </View>
            }
            <View style={styles.toolbarRow}>
              <View>
                <VotePanel
                  item={lightBoxItem.toJS()}
                  voteFeedItem={this.props.voteFeedItem}
                  openRegistrationView={this.props.openRegistrationView}
                />
              </View>
              <View>
                <CommentsLink
                  parentId={lightBoxItem.get('id')}
                  commentCount={lightBoxItem.get('commentCount')}
                  openComments={this.openPostComments}
                  reverse
                />
              </View>
              <View>
                {!isSystemUser &&
                <PlatformTouchable onPress={() => this.showRemoveDialog(lightBoxItem)}>
                  <View style={styles.toolbar__button}>
                    <Icon style={styles.toolbar__icon} name={this.itemIsCreatedByMe(lightBoxItem) ? 'delete' : 'flag'} />
                  </View>
                </PlatformTouchable>
                }
              </View>
              <View>
                <PlatformTouchable onPress={this.onShare.bind(this, itemImage)}>
                  <View style={styles.toolbar__button}>
                    <Icon style={styles.toolbar__icon} name="share" />
                  </View>
                </PlatformTouchable>
              </View>
            </View>

          </View>
        </ModalBackgroundView>
        </ScrollView>
      </Modal>
    );
  }
}

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: IOS ? 'transparent' : theme.white,
  },
  header: {
    height: isIphoneX ? 66 : 56,
    marginTop: IOS ? (isIphoneX ? 18 : 8) : 0,
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top:0,
    right: 0,
    zIndex: 2,
    backgroundColor: IOS ? 'transparent' : 'rgba(255,255,255,.3)',
  },
  header__icon: {
    position: 'absolute',
    top: IOS ? 25 : 10,
    left: 15,
    right: 15,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  headerTitle: {
    marginLeft: 15,
    marginTop: IOS ? 5 : 0,
  },
  headerTitleText: {
    color: theme.primary,
    fontWeight: 'bold',
    fontSize: 14
  },
  date: {
    marginTop: IOS ? -3 : 0,
  },
  dateText: {
    color: theme.primary,
    opacity: 0.9,
    fontSize: 12
  },
  imageCaptionText: {
    color: theme.black,
    padding: 20,
    paddingTop: 10,
    paddingBottom: IOS ? 10 : 0,
    paddingLeft: isIphoneX ? 30 : 20,
    fontSize: 16,
    lineHeight: 25,
  },
  toolbar: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 0,
    paddingBottom: isIphoneX ? 10 : 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    minHeight: isIphoneX ? 68 : 58,
    zIndex: 3,
    backgroundColor: IOS ? 'transparent' : 'rgba(255,255,255,.3)',
  },
  toolbarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 58,
    alignItems: 'center',
    paddingHorizontal: isIphoneX ? 20 : 10,
    backgroundColor: IOS ? 'rgba(255,255,255,.5)' : 'transparent',
  },
  toolbar__buttons: {
    justifyContent:'flex-end',
    flexDirection: 'row',
    paddingTop: 0,
  },
  toolbar__button: {
    borderRadius: 25,
    width: 50,
    height: 50,
    marginLeft: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  toolbar__icon: {
    backgroundColor: 'transparent',
    fontSize: 20,
    color: theme.grey4,
  }
});

const select = store => {
  return {
    lightBoxItem: getLightboxItem(store),
    isLightBoxOpen: isLightBoxOpen(store),
  };
};

const mapDispatch = {
  removeFeedItem,
  closeLightBox,
  voteFeedItem,
  openRegistrationView,
  openComments,
};

export default connect(select, mapDispatch)(LightBox);
