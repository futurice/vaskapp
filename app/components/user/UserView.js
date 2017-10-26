import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity,
  TouchableHighlight, Image, Platform } from 'react-native';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';

import {
  getUserImages,
  getUserPicture,
  getUserProfile,
  getUserTeam,
  getTotalVotesForUser,
  isLoadingUserImages,
} from '../../concepts/user';

import { removeFeedItem, voteFeedItem,} from '../../actions/feed';
import { openRegistrationView, getUserName, getUserId } from '../../concepts/registration';

import { openLightBox } from '../../concepts/lightbox';

import ParallaxView from 'react-native-parallax-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { openComments } from '../../concepts/comments';

import ImageGrid from './ImageGrid';
import theme from '../../style/theme';
import typography from '../../style/typography';
import Header from '../common/Header';
import BackLink from '../common/BackLink';
import AnimateMe from '../AnimateMe';
import Loader from '../common/Loader';
import Text from '../common/MyText';

const headerImage = require('../../../assets/patterns/sea.png');

const { height, width } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';
const headerHeight = width;


class UserView extends Component {
  render() {

    const { images, isLoading, totalVotes, totalSimas,
      profile, userTeam, userName, userInfo, navigator, profilePicture } = this.props;

    const userPhoto = profilePicture;
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
            {!IOS && <BackLink onPress={() => navigator.pop()} /> }
            </View>
          )}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <View style={styles.profileInfo}>

                <AnimateMe delay={300} animationType="fade-from-bottom">
                  <Text style={styles.headerTitle}>
                    {profile.get('name')}
                  </Text>
                </AnimateMe>

                <AnimateMe delay={400} animationType="fade-from-bottom">
                  <Text style={styles.headerSubTitle}>
                    {userTeam}
                  </Text>
                </AnimateMe>

                {!!profile.get('info') &&
                  <AnimateMe delay={900} animationType="fade-in">
                    <Text style={styles.profileInfoText}>
                      “{profile.get('info')}”
                    </Text>
                  </AnimateMe>
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

            <AnimateMe delay={1500} animationType="fade-in">
              <ImageGrid
                navigator={navigator}
                isLoading={isLoading}
                images={images}
                openRegistrationView={this.props.openRegistrationView}
                openComments={this.props.openComments}
                openLightBox={this.props.openLightBox}
                removeFeedItem={this.props.removeFeedItem}
                voteFeedItem={this.props.voteFeedItem}
              />
            </AnimateMe>
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
    left: 23,
    top: IOS ? 33 : 23,
    zIndex: 2,
  },
  backLinkText: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, .5)'
  },
  backLinkIcon: {
    color: theme.primary
  },
  profileInfo: {
    backgroundColor: 'rgba(255, 255, 255, .6)',
    padding: 25,
    alignItems: 'flex-start',
  },
  headerTitle: typography.h1,
  headerSubTitle: typography.h2,
  profileInfoText: typography.paragraph,
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
  totalVotes: getTotalVotesForUser,
  userId: getUserId,
  userName: getUserName,
  userTeam: getUserTeam,
});

export default connect(mapStateToProps, mapDispatchToProps)(UserView);
