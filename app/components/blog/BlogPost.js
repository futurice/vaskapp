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

    const fontFamilySerif = IOS ? 'NotoSerif' : 'NotoSerif';
    const fontFamily = IOS ? 'Futurice' : 'Futurice-Regular';
    const fontFamilyCode = fontFamily;
    const textColor = 'rgba(0,0,0,0.8)';
    const subTextColor = 'rgba(0,0,0,0.6)';

    const html = `
    <!DOCTYPE html>
    <html>
      <style>
        html,body {
          margin: 0;
          padding: 0;
          min-height: 100%;
          max-width: ${width}px;
          overflow-x: hidden;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          font-weight: 400;
        }

        body {
          padding: 0 25px;
        }

        h1, h2, h3, h4, h5 {
          color: ${textColor};
          font-family: '${fontFamily}', sans-serif;
          font-weight: bold;
          letter-spacing: -.015em;
          line-height: 1.3;
          margin: 0;
          padding: 0;
        }
        h1, h2 {
          margin-top: 7px;
          font-size: 25px;
        }
        h3, h4, h5 {
          margin-bottom: 7px;
          font-size: 22px;
        }
        p {
          margin: 0 0 22px;
        }

        a {
          text-transform: underline;
          color: ${textColor};
          font-weight: normal;
        }

        html, body, p {
          font-family: '${fontFamilySerif}', serif;
          font-weight: normal;
          color: ${textColor};
          font-size: 17px;
          letter-spacing: -.003em;
          line-height: 1.52;
        }
        p { margin-bottom: 25px; }
        ul, ol { padding-left: 30px; margin-left: 0; }

        img, iframe {
          max-width:100%;
        }

        img {
          min-width: 100%;
          min-width: ${width}px;
          margin: 0 -25px;
        }

        figure {
          margin: 0 0 25px;
          padding: 0;
          font-family: '${fontFamily}', sans-serif;
        }
        figcaption {
          font-size: 0.9em;
          color: ${subTextColor};
          text-align: center;
        }


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
          font-family: '${fontFamilyCode}', sans-serif;
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

    console.log(post.content);

    return (
      <View style={{ flex: 1 }}>
        {!IOS &&
        <ScrollHeader
          icon="arrow-back"
          onIconClick={() => navigator.pop()}
          subtitle={unescapeHtml(post.title)}
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
                style={{width: width, height: webViewHeight }}
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
    paddingHorizontal: 0,
  },
  detailTitle: typography.h1({ paddingHorizontal: 25 }),
  detailPersonTitle: typography.h2({ paddingHorizontal: 25, color: theme.midgrey }),
});

export default BlogPost;