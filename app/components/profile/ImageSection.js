import React, { Component, PropTypes } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { noop } from 'lodash'
import autobind from 'autobind-decorator';

import { openUserView, fetchUserProfile, getMyImages, isLoadingUserImages } from '../../concepts/user';
import { getUserId, getUserName } from '../../concepts/registration';
import { openLightBox } from '../../concepts/lightbox';
import { openComments } from '../../concepts/comments';

import Text from '../common/MyText';
import theme from '../../style/theme';
import typography from '../../style/typography';

import UserView from '../user/UserView';
import AnimateMe from '../AnimateMe';
import ImageRow from '../image/ImageRow';
import Section from './Section';

const IOS = Platform.OS === 'ios';

class ImageSection extends Component {

  componentDidMount() {
    this.props.fetchUserProfile();
  }

  componentWillReceiveProps({ userId }) {
    if (this.props.userId !== userId) {
      this.props.fetchUserProfile();
    }
  }


  @autobind
  seeMoreImages() {
    this.props.openUserView({ id: this.props.userId });
    this.props.navigator.push({ component: UserView, name: this.props.userName, showName: true });
  }

  render() {
    const { title, key, navigator, ...rest } = this.props;
    return (
      <Section
        title={title}
        key={key}
        seeMoreText="See All"
        seeMorePress={this.seeMoreImages}
        showSeeMore={!!(this.props.images && this.props.images.size)}
      >
        <AnimateMe delay={500} animationType="fade-in">
          <ImageRow
          hideBorder
          navigator={navigator}
          max={7}
          {...rest}
          // isLoading={isLoading}
          // images={images}
          // openRegistrationView={this.props.openRegistrationView}
          // openComments={this.props.openComments}
          // openLightBox={this.props.openLightBox}
          // removeFeedItem={this.props.removeFeedItem}
          // voteFeedItem={this.props.voteFeedItem}
          />
        </AnimateMe>
      </Section>
    );
  }
}


const styles = StyleSheet.create({});

const select = createStructuredSelector({
  images: getMyImages,
  userId: getUserId,
  userName: getUserName,
  isLoading: isLoadingUserImages,
});
const mapDispatchToProps = { fetchUserProfile, openLightBox, openComments, openUserView };

export default connect(select, mapDispatchToProps)(ImageSection);

