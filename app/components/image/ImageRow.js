import React, { Component } from 'react';
import { fromJS } from 'immutable';
import { noop } from 'lodash';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import autobind from 'autobind-decorator';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Loader from '../common/Loader';
import Text from '../common/MyText';
import theme from '../../style/theme';
import CommentsView from '../comment/CommentsView';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  imageContainer:{
    margin: 0,
    marginBottom: 0,
    paddingLeft: 20,
    paddingBottom: 20,
    paddingTop: 20,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  gridImageWrap: {
    height: 90,
    width: 90,
    marginRight: 20,
    backgroundColor: theme.white,
  },
  gridImage: {
    height: 90,
    width: 90,
    borderRadius: 10,
    backgroundColor: theme.stable,
  },
  imageTitle: {
    textAlign: 'center',
    color: theme.noData,
    margin: 20,
    marginTop: 40,
    fontSize: 15,
  },
  imageTitleWrap: {
    flex: 1,
    marginTop: 0
  },
});

// const tabIcons = ['grid-on', 'filter-none'];
const tabIcons = ['view-module', 'list'];

class ImageRow extends Component {
  constructor(props) {
    super(props);

    this.state = { selectedTab: 0 }
  }

  @autobind
  openPostComments(postId) {
    this.props.openComments(postId);

    this.props.navigator.push({
      component: CommentsView,
      showName: true,
      name: 'Comment',
    });
  }


  render() {
    const {
      images,
      isLoading,
      voteFeedItem,
      removeFeedItem,
      openRegistrationView,
      openComments,
      openLightBox,
      hideBorder,
      max
    } = this.props;
    const { selectedTab } = this.state;
    const imageCount = images.size;

    return (
    <View>

      {isLoading && !images.size &&
        <View style={styles.loader}>
          <Loader size="large" />
        </View>
      }

      {!isLoading && !images.size &&
        <View style={styles.imageTitleWrap}>
          <Text style={styles.imageTitle}>No images</Text>
        </View>
      }

      {imageCount > 0 &&
        <ScrollView horizontal showsHorizontalScrollIndicator={false} >
          <View style={styles.imageContainer}>
            {images.slice(0, max || imageCount).map(image =>
              <View key={image.get('id')} style={styles.gridImageWrap}>
                <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => openLightBox(image.get('id'))}
                >
                  <Image
                    key={image.get('id')}
                    style={styles.gridImage}
                    source={{uri: image.get('url')}}/>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      }
    </View>
  );
  }
};

ImageRow.defaultProps = {
  images: fromJS([]),
  isLoading: false,
  openLightbox: noop,
}

export default ImageRow;
