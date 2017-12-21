'use strict'

import React, { Component } from 'react';
import { View, Animated } from 'react-native'

import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import { changeTab } from '../actions/navigation';
import { getFeedSortType, setFeedSortType } from '../concepts/sortType';
import { getUnreadConversationCount } from '../concepts/conversations';

import MoodView from './MoodView';
import HoursView from './HoursView';
import CalendarView from './CalendarView';
import FeedView from './FeedView';
import ProfileView from './ProfileView';
import EventMapView from './EventMapView';

import Header from '../components/common/MainHeader';
import ScrollableTabs  from 'react-native-scrollable-tab-view';
import Tabs from '../constants/Tabs';
import IconTabBar from '../components/common/MdIconTabBar';
import LightBox from '../components/lightbox/Lightbox';

const HEADER_HIDDEN_ON_TABS = [Tabs.MAP];

const theme = require('../style/theme');

const initialTabIndex = 0;
const initialTab = Tabs.FEED;


class AndroidTabNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headerVisibility: new Animated.Value(1),
    }
  }

  componentDidMount() {
    const { changeTab } = this.props;
    changeTab(initialTab)
  }

  @autobind
  toggleHeader(show) {
    Animated.timing(this.state.headerVisibility, { toValue: show ? 1 : 0, duration: 300 }).start();
  }

  @autobind
  onChangeTab({ ref }) {
    this.props.changeTab(ref.props.id);
  }

  render() {
    const {
      navigator,
      currentTab,
      selectedSortType,
      unreadConversationCount,
    } = this.props;


    // # Header animation on feed page
    const headerHeight = this.state.headerVisibility.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 56]
    });

    const headerTranslateY = this.state.headerVisibility.interpolate({
      inputRange: [0, 1],
      outputRange: [-56, 0]
    });

    const feedHeaderStyles = {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      zIndex: 2,
      height: headerHeight,
      transform: [{ translateY: headerTranslateY }],
    };

    const hiddenHeaderStyles = {
      height: 0,
      transform: [],
    };

    // # Header style processing
    const hideHeader = HEADER_HIDDEN_ON_TABS.indexOf(currentTab) >= 0;
    const isFeedView = currentTab === Tabs.FEED;
    const headerStyles = [];

    if (isFeedView) {
      headerStyles.push(feedHeaderStyles)
    }

    if (hideHeader) {
      headerStyles.push(hiddenHeaderStyles);
    }

    return (
      <View style={{ flexGrow: 1, flex: 1 }}>
        <Animated.View style={headerStyles}>
          <Header
            title={null}
            backgroundColor={theme.white}
            currentTab={currentTab}
            selectedSortType={selectedSortType}
            setFeedSortType={this.props.setFeedSortType}
            navigator={navigator}
            unreadConversationCount={unreadConversationCount}
          />
        </Animated.View>
        <ScrollableTabs
          onChangeTab={this.onChangeTab}
          initialPage={initialTabIndex}
          tabBarPosition={'bottom'}
          tabBarBackgroundColor={theme.white}
          tabBarActiveTextColor={theme.secondary}
          tabBarInactiveTextColor={theme.grey4}
          locked={true}
          scrollWithoutAnimation={true}
          prerenderingSiblingsNumber={0}
          renderTabBar={() => <IconTabBar />}
        >
          <FeedView
            onScrollUp={() => this.toggleHeader(true)}
            onScrollDown={() => this.toggleHeader(false)}
            navigator={navigator}
            tabLabel={{ title: 'Feed', icon: 'looks' }}
            id={Tabs.FEED}
          />
          {false && <CalendarView id={Tabs.CALENDAR} navigator={navigator} tabLabel={{ title: 'Event', icon: 'event' }} />}
          <EventMapView navigator={navigator} id={Tabs.MAP} tabLabel={{ title: 'Geo', icon: 'public' }} />
          <ProfileView navigator={navigator} id={Tabs.SETTINGS} tabLabel={{ title: 'You', icon: 'account-circle' }} />
        </ScrollableTabs>
        <LightBox navigator={this.props.navigator} />
      </View>
    )
  }
}


const mapDispatchToProps = {
  changeTab,
  setFeedSortType,
};

const select = state => {
  return {
    selectedSortType: getFeedSortType(state),
    currentTab: state.navigation.get('currentTab'),
    unreadConversationCount: getUnreadConversationCount(state),
  }
};

export default connect(select, mapDispatchToProps)(AndroidTabNavigation);
