'use strict';

import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  WebView,
} from 'react-native';
import theme from '../../style/theme';
import Toolbar from '../calendar/EventDetailToolbar';
import ScrollHeader from '../common/ScrollHeader';
const IOS = Platform.OS === 'ios';


class WebViewer extends Component {


  render() {

    const { hideHeader, navigator } = this.props;
    let { url, name } = this.props.route;

    if (IOS && url.indexOf('https') < 0) {
      url = 'https://crossorigin.me/' + url;
    }

    const showHeader = !hideHeader && !IOS;
    const topPadding = IOS ? 20 : 0;

    return (
      <View style={[styles.container, { paddingTop: showHeader ? 0 : topPadding }]}>
        {showHeader &&
          <ScrollHeader title={name} color={theme.primary} onIconClick={() => navigator.pop()} /> }

        {url &&
          <WebView
            source={{uri: url}}
            scalesPageToFit={false}
            style={{ flex: 1 }}

            allowsInlineMediaPlayback={true}
            domStorageEnabled={true}
            thirdPartyCookiesEnabled={true}
            mixedContentMode={'always'}
            javaScriptEnabled={true}
          />
        }
      </View>
    );
  }

}

WebViewer.propTypes = {
  url: PropTypes.string,
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});


export default WebViewer;
