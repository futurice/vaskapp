import React, { Component } from 'react';
import { fromJS } from 'immutable';
import { noop } from 'lodash';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import autobind from 'autobind-decorator';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Loader from '../common/Loader';
import Text from '../common/MyText';
import theme from '../../style/theme';
import FeedListItem from '../feed/FeedListItem';
import CommentsView from '../comment/CommentsView';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 0,
    borderTopColor: '#eee',
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  filterRowBtn: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 35,
  },
  selectedBtn: {
    color: theme.primary
  },
  filterRowBtnIcon: {
    fontSize: 28,
    color: '#aaa'
  },
  imageContainer:{
    margin: 0,
    marginBottom: 30,
    padding: 24,
    paddingTop: 5,
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 50,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  gridImageWrap: {
    height: width / 3 - 18,
    width: width / 3 - 18,
    borderRadius: 0,
    margin: 1,
    backgroundColor: theme.white,
  },
  gridImage: {
    backgroundColor: theme.stable,
    height: width / 3 - 18,
    width: width / 3 - 18,
    borderRadius: 0,
  },
  imageTitle: {
    textAlign: 'center',
    color: theme.grey,
    margin: 20,
    marginTop: 40,
    fontSize: 15,
    fontWeight: '600'
  },
  imageTitleWrap: {
    flex: 1,
    marginTop: 0
  },
});

// const tabIcons = ['grid-on', 'filter-none'];
const tabIcons = ['view-module', 'list'];

class ImageGrid extends Component {
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
      openLightBox
    } = this.props;
    const { selectedTab } = this.state;

    return (
    <View>

      <View style={styles.filterRow}>
        {tabIcons.map((tab, index) =>
          <TouchableOpacity
            style={styles.filterRowBtn}
            key={tab}
            onPress={() => this.setState({ selectedTab: index })}
          >
            <Icon
              name={tab}
              style={[styles.filterRowBtnIcon, selectedTab === index && styles.selectedBtn]} />
          </TouchableOpacity>
        )}
      </View>

      {isLoading &&
        <View style={styles.loader}>
          <Loader size="large" />
        </View>
      }

      {!isLoading && !images.size &&
        <View style={styles.imageTitleWrap}>
          <Text style={styles.imageTitle}>No photos</Text>
        </View>
      }

      {images.size > 0 && selectedTab === 0 &&
        <View style={styles.imageContainer}>
          {images.map(image =>
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
      }

      {images.size > 0 && selectedTab === 1 && images.map(item =>
        <FeedListItem
          item={item.toJS()}
          key={item.get('id')}
          removeFeedItem={removeFeedItem}
          voteFeedItem={voteFeedItem}
          openRegistrationView={openRegistrationView}
          openComments={this.openPostComments}
          openLightBox={openLightBox}
        />
      )}
    </View>
  );
  }
};

ImageGrid.defaultProps = {
  images: fromJS([]),
  isLoading: false,
  openLightbox: noop,
}

export default ImageGrid;
