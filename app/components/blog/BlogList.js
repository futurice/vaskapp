import React, { Component, PropTypes } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  ListView,
  Dimensions,
  Navigator,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  View,
  WebView,
} from 'react-native';
import { get, isNil } from 'lodash';
import moment from 'moment';
import * as ENV from '../../../env';


import PlatformTouchable from '../common/PlatformTouchable';
import Text from '../common/MyText';
import Toolbar from '../common/Toolbar';
import ScrollHeader from '../common/ScrollHeader';
import Icon from 'react-native-vector-icons/Ionicons';

import typography from '../../style/typography';
import theme from '../../style/theme';
import BlogPost from './BlogPost'

const { width } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';
const defaultCount = 10;

var BlogApp = React.createClass({

  getInitialState() {
    return {
      dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2, }),
      loaded: false,
      count: defaultCount,
    };
  },

  componentDidMount() {
    this.fetchData();
  },

  fetchData() {
    const { url } = this.props.route;
    const { count } = this.state;

    if (isNil(url)) {
      console.log('No url passed to Blog App');
      return;
    }

    fetch(`https://api.rss2json.com/v1/api.json?api_key=${ENV.RSS_API_KEY}&count=${count || defaultCount}&rss_url=${encodeURIComponent(url)}` )
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(responseData.items || []),
        loaded: true,
      });
    })
    .catch((error) => {
      this.setState({
        error: true,
        loaded: true,
      });
    })
    .done();
  },

  daysAgo(date){

    const diff = (new Date().getTime() - moment(date).valueOf()) / 60000; // minutes

    if(diff < 60)
      return Math.round(diff) + 'minutes';
    else if(diff < 60 * 24)
      return Math.round(diff/60) + 'hours';
    else (diff < 60 * 24)
      return Math.round(diff/60/24) + 'days';

  },

  renderLoadingView() {
    return (
      <View style={[styles.container, styles.loading]}>
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.primary} animating={true} />
        </View>
      </View>
    );
  },

  renderErrorView() {
    return (
      <View style={styles.container}>
        <Text>Error loading posts</Text>
      </View>
    );
  },
  showSinglePost(post){
    const { navigator } = this.props;
    const { title, link } = post;
    navigator.push({
      component: BlogPost,
      post,
      showName: true,
      name: title,
      share: { url: link, title, message: title }
    });
  },
  onLoadMoreItems() {
    const { count } = this.state;
    this.setState({ count: count + 10 }, this.fetchData);
  },
  render() {
    if (!this.state.loaded) { return this.renderLoadingView(); }
    if (this.state.error) { return this.renderErrorView(); }

    return (
      <View style={styles.wrap}>
        {!IOS &&
          <ScrollHeader
            icon={'arrow-back'}
            onIconClick={() => this.props.navigator.pop()}
            title={get(this.props, 'route.name')}
          />
        }

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderPost}
          style={styles.listView}
          onEndReached={this.onLoadMoreItems}
        />
      </View>
    );
  },

  renderPost(post, i) {
    return (
      <View style={styles.card}>
        <PlatformTouchable onPress={this.showSinglePost.bind(this, post)} activeOpacity={1}>
          <View>
            <View style={styles.cardImgWrap}>
              <Image source={{ uri: get(post, 'enclosure.link') }} style={styles.cardImg} />
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{post.title}</Text>
              {post.author ? <Text style={styles.cardSubTitle}>by {post.author} {this.daysAgo(post.pubDate)} ago</Text> : <View /> }
              <Text style={styles.cardText} numberOfLines={3} ellipsizeMode={'tail'}>{post.description}</Text>
            </View>
          </View>
        </PlatformTouchable>
      </View>
    );
  }


});


var styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap:'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.stable,
  },
  loading: {
    flexDirection: 'column',
  },
  loader: {
    marginBottom: 15,
  },
  listView: {
    backgroundColor: theme.stable,
    flex:1,
    flexWrap:'wrap',
    paddingBottom: 50,
    paddingTop: IOS ? 20 : 0,
  },
  card: {
    flex:1,
    minHeight: 200,
    backgroundColor: theme.white,
    margin: 0,
    marginBottom: 20,
    elevation: 6,
    borderRadius:2,
    shadowColor: theme.secondaryDark,
    shadowOpacity: 0.09,
    shadowRadius: 7,
    shadowOffset: {
      height: 5,
      width: 0
    },
  },
  cardImgWrap:{
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    flex: 1,
    height: width / 2,
    backgroundColor: theme.stable,
    overflow:'hidden'
  },
  cardImg:{
    height: width / 2,
    width
  },
  cardContent:{
    flex:1,
    padding: 25,
  },
  cardTitle: typography.h1,
  cardSubTitle: typography.h2,
  cardText: typography.paragraph,
});

export default BlogApp;
