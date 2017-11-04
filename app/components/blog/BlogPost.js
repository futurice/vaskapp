import React, { Component, PropTypes } from 'react';
import {
  Animated,
  Easing,
  Image,
  ScrollView,
  StyleSheet,
  ListView,
  Dimensions,
  TouchableHighlight,
  InteractionManager,
  Platform,
  View,
  Linking,
  WebView,
} from 'react-native';
import { get } from 'lodash';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ParallaxView from 'react-native-parallax-view';
import Share from 'react-native-share';

import PlatformTouchable from '../common/PlatformTouchable';
import AnimateMe from '../AnimateMe';
import Text from '../common/MyText';
import ScrollHeader from '../common/ScrollHeader';
import theme from '../../style/theme';
import typography from '../../style/typography';
import { unescapeHtml } from '../../utils/html';

const { width } = Dimensions.get('window');
const headerImage = require('../../../assets/patterns/sea.png');
const IOS = Platform.OS === 'ios';
const headerHeight = width * 0.6;

var BlogPost = React.createClass({
  getInitialState: function() {
    return {
      refresh: null,
      webViewHeight: 500,
    };
  },

  onPressBack() {
    const {navigator} = this.props
    navigator.pop()
  },

  updateWebview(event) {
    const { url, jsEvaluationValue, data } = event;

    if (jsEvaluationValue) {
      this.setState({ webViewHeight: parseInt(jsEvaluationValue) + 50 });
    } else if (url && url.indexOf('http') === 0) {
      Linking.openURL(url);

      // DIRTY trick to cancel webview link redirect and refresh content
      this.setState({ refresh: 1 });
      setTimeout(() => this.setState({ refresh: null }), 100);
    }
  },
  onMessage({ nativeEvent }) {
    if (!IOS) {
      const webViewHeight = nativeEvent.data;
      this.setState({ webViewHeight: parseInt(webViewHeight) + 20 });
    }
  },

  render() {
    const { route, navigator } = this.props;
    const { refresh, webViewHeight } = this.state;

    const { post, share } = route;
    const postImage = get(post, 'enclosure.link');
    const postDate = moment(get(post, 'pubDate')).format('DD.MM.YYYY');

    if (refresh || !post) {
      return null;
    }

    // For android only
    const heightScript = IOS ? '' : `
    <script>
      function waitForBridge() {
        if (window.postMessage.length !== 1){
          setTimeout(waitForBridge, 200);
        } else {
          var height = document.getElementById('body').offsetHeight;
          window.postMessage(height);
        }
      }
      window.onload = waitForBridge;
    </script>`;

    const fontFamilySerif = IOS ? 'Palatino' : 'serif';
    const fontFamily = IOS ? 'Futurice' : 'Futurice-Regular';

    const html = `
    <!DOCTYPE html>
    <html>
      <style>
        html,body {margin:0;padding:0, min-height: 100%; max-width: ${width - 50}px; overflow-x:hidden; }
        h1, h2, h3 {color: ${theme.dark}; font-weight: 100; }
        h1, h2 {
          margin: 0 0 15px;
          padding: 0;
        }
        h3 {
          margin: 0 0 10px;
          padding: 0;
        }
        a { text-transform: underline; color: ${theme.dark} }
        html, body, p { font-family: '${fontFamily}', serif; font-weight: 100, font-size: 14px; line-Height: 23px; color: ${theme.dark} }
        p { margin-bottom: 25px; }
        ul, ol { padding-left: 30px; margin-left: 0; }
        img, iframe {max-width:100%;}


        ol pre {
          margin-left: -30px;
          padding-left: 30px;
        }

        pre {
          margin: 0 0 5px;
          padding: 10px;
          overflow: auto;
          font-size: 75%;
          line-height: 1.45;
          background-color: #f6f8fb;
          border-radius: 3px;
          white-space: wrap;
          overflow-x: auto;
          font-family: '${fontFamily}';
        }
        code {
          margin: 0;
        }
      </style>
      <body id="body">
        ${heightScript}
        ${post.content}
      </body>
    </html>`;

    return (
      <View style={{ flex: 1}}>
        {!IOS &&
        <ScrollHeader
          icon="arrow-back"
          onIconClick={() => navigator.pop()}
          subtitle={post.title}
          rightIcon="share"
          onRightIconClick={() => Share.open(share)}
          />
        }
        <ParallaxView
          onScroll={this._onScroll}
          backgroundSource={postImage ? { uri: postImage } : headerImage}
          windowHeight={headerHeight}
          style={{ backgroundColor: theme.white }}
          scrollableViewStyle={{ shadowColor: theme.transparent }}
          header={(
            <View />
          )}
        >

          <View style={styles.content}>
            <AnimateMe delay={300} animationType="fade-from-bottom">
              <Text style={styles.detailTitle} >{unescapeHtml(post.title)}</Text>
            </AnimateMe>
            <AnimateMe delay={400} animationType="fade-from-bottom">
              <Text style={styles.detailPersonTitle}>
                {post.author}{!!post.author && ' • '}{postDate}
              </Text>
            </AnimateMe>

            <AnimateMe delay={900} style={{ flex: 1 }} animationType="fade-in">
              <WebView
                injectedJavaScript="document.body.scrollHeight;"
                source={{ html }}
                scrollEnabled={true}
                domStorageEnabled={true}
                javaScriptEnabled={true}
                mixedContentMode={'always'}
                allowsInlineMediaPlayback={true}
                onNavigationStateChange={this.updateWebview}
                onMessage={this.onMessage}
                automaticallyAdjustContentInsets={true}
                style={{width: Dimensions.get('window').width - 40, height: webViewHeight }}
              ></WebView>
            </AnimateMe>
          </View>

        </ParallaxView>
      </View>
      );
  }

});

var styles = StyleSheet.create({
  detailPerson:{
    flex:1,
    backgroundColor:'#FFF'
  },
  detailPersonImg:{
    width: Dimensions.get('window').width,
    height:200,
  },
  content:{
    padding: 25,
  },
  detailTitle: typography.h1(),
  detailPersonTitle: typography.h2(),
});

export default BlogPost;