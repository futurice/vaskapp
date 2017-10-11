import { createStructuredSelector } from 'reselect';
import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity,
  TouchableHighlight, Image, Platform } from 'react-native';
import { connect } from 'react-redux';

import {
  getUserImages,
  getUserPicture,
  getUserProfile,
  getUserTeam,
  getTimeSinceLastPost,
  getTotalSimas,
  getTotalVotesForUser,
  fetchUserImages,
  isLoadingUserImages,
} from '../../concepts/user';

import { removeFeedItem, voteFeedItem,} from '../../actions/feed';
import { openRegistrationView } from '../../actions/registration';
import { getUserName, getUserId } from '../../reducers/registration';

import { openLightBox } from '../../concepts/lightbox';
import { openComments } from '../../concepts/comments';

import ParallaxView from 'react-native-parallax-view';
import Icon from 'react-native-vector-icons/MaterialIcons';

import ImageGrid from './ImageGrid';
import theme from '../../style/theme';
import Header from '../common/Header';
import Loader from '../common/Loader';
import Text from '../common/MyText';

const headerImage = require('../../../assets/patterns/sea.png');

const { height, width } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';
const headerHeight = width;


class UserView extends Component {
  componentDidMount() {
    const { user } = this.props.route;
    const { userId } = this.props;

    if (user && user.id) {
      this.props.fetchUserImages(user.id);
    } else {
      this.props.fetchUserImages(userId);
    }
  }

  render() {

    const { images, isLoading, totalVotes, totalSimas, timeSinceLastPost,
      profile, userTeam, userName, userInfo, navigator, profilePicture } = this.props;
    let { user, avatar } = this.props.route;

    // Show Current user if not user selected
    if (!user) {
      user = { name: userName }
    }

    const userPhoto = profilePicture || avatar;
    const imagesCount = images.size;

    return (
      <View style={{ flex: 1 }}>
        <ParallaxView
          backgroundSource={userPhoto ? { uri: userPhoto } : headerImage}
          windowHeight={headerHeight * 0.75}
          style={{ backgroundColor:theme.white }}
          scrollableViewStyle={{ shadowColor: theme.transparent }}
          header={(
            <View>
              {!isIOS &&
              <View style={styles.backLink}>
                <TouchableHighlight onPress={() => navigator.pop()} style={styles.backLinkText} underlayColor={'rgba(255, 255, 255, .1)'}>
                  <Icon name="arrow-back" size={28} style={styles.backLinkIcon}  />
                </TouchableHighlight>
              </View>
              }
            </View>
          )}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.profileInfo}>
                <Text style={styles.headerTitle}>
                  {user.name || profile.get('name')}
                </Text>
                <Text style={styles.headerSubTitle}>
                  {userTeam || user.team}
                </Text>


                {!!profile.get('info')
                ?
                <Text style={styles.profileInfoText}>
                  “{profile.get('info')}”
                </Text>
                :
                <Text style={[styles.profileInfoText, { opacity: 0.5 }]}>
                  No info
                </Text>
                }

                {/*
                <View style={styles.headerKpis}>
                  <View style={styles.headerKpi}>
                    <Text style={styles.headerKpiValue}>{!isLoading ? imagesCount : '-'}</Text>
                    <Text style={styles.headerKpiTitle}>photos</Text>
                  </View>
                  <View style={styles.headerKpi}>
                    <Text style={styles.headerKpiValue}>{!isLoading ? timeSinceLastPost : '-'}</Text>
                    <Text style={styles.headerKpiTitle}>days since last photo</Text>
                  </View>
                </View>
              */}

              </View>
            </View>

            <ImageGrid
              isLoading={isLoading}
              images={images}
              openRegistrationView={this.props.openRegistrationView}
              openComments={this.props.openComments}
              openLightBox={this.props.openLightBox}
              removeFeedItem={this.props.removeFeedItem}
              voteFeedItem={this.props.voteFeedItem}
            />
          </View>
        </ParallaxView>
      </View>
    );
  }
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    minHeight: height / 2
  },
  header: {
    flex:1,
    elevation: 3,
    paddingTop: 0,
    // minHeight: headerHeight,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  backLink: {
    position: 'absolute',
    left: 7,
    top: 7,
    zIndex: 2,
  },
  backLinkText: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.white
  },
  backLinkIcon: {
    color: theme.blue2
  },
  profileInfo: {
    backgroundColor: 'rgba(255, 255, 255, .6)',
    padding: 25,
    alignItems: 'flex-start',
  },
  headerTitle:{
    fontSize: 24,
    fontWeight: 'normal',
    textAlign: 'center',
    color: theme.primary,
    marginBottom: 2,
    paddingHorizontal: 0,
    backgroundColor: theme.transparent,
  },
  headerSubTitle: {
    fontSize: 14,
    fontWeight: 'normal',
    marginBottom: 30,
    textAlign: 'center',
    // color: 'rgba(0,0,0,.5)',
    color: theme.primary,
  },
  profileInfoText: {
    color: theme.primary,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.7,
  },
  avatar: {
    marginBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: 100,
    height: 100,
    backgroundColor: theme.stable,
    borderRadius: 50,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarText: {
    backgroundColor: theme.transparent,
    color: theme.blue1,
    fontSize: 60,
  },
  headerKpis: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 20,
  },
  headerKpi: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 0,
    marginTop: 0,
  },
  headerKpiTitle: {
    color: theme.primary,
    fontWeight: '500',
    fontSize: 10,
    backgroundColor: theme.transparent,
  },
  headerKpiValue: {
    fontSize: 16,
    color: theme.primary,
    fontWeight: '400',
    minWidth: 30,
    textAlign: 'left',
    backgroundColor: theme.transparent
  },
});


const mapDispatchToProps = {
  fetchUserImages,
  openRegistrationView,
  openComments,
  openLightBox,
  removeFeedItem,
  voteFeedItem,
};

const mapStateToProps = createStructuredSelector({
  images: getUserImages,
  profile: getUserProfile,
  profilePicture: getUserPicture,
  isLoading: isLoadingUserImages,
  totalSimas: getTotalSimas,
  totalVotes: getTotalVotesForUser,
  userId: getUserId,
  userName: getUserName,
  userTeam: getUserTeam,
  timeSinceLastPost: getTimeSinceLastPost,
});

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
