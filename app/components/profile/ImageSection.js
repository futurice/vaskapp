import React, { Component, PropTypes } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import { noop } from 'lodash'

import Text from '../common/MyText';
import theme from '../../style/theme';
import typography from '../../style/typography';

import AnimateMe from '../AnimateMe';
import ImageGrid from '../user/ImageGrid';
import Section from './Section';

const IOS = Platform.OS === 'ios';


class ImageSection extends Component {
  render() {
    const { title, key, navigator, ...rest } = this.props;
    return (
      <Section title={title} key={key}>
        <AnimateMe delay={500} animationType="fade-in">
          <ImageGrid
          navigator={navigator}
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


const styles = StyleSheet.create({

});

export default ImageSection;
