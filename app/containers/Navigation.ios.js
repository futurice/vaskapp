'use strict';

import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import EventMapView from './EventMapView';
import CalendarView from './CalendarView';

import CompetitionView from './CompetitionNavigator';
import FeedView from './FeedView';
import ProfileView from './ProfileView';

import Tabs from '../constants/Tabs';
import { isUserLoggedIn } from '../concepts/registration';
import { getEvents } from '../reducers/event';
import { changeTab } from '../actions/navigation';
import MDIcon from 'react-native-vector-icons/MaterialIcons';

import ICONS from '../constants/Icons';
import ScrollableTabs  from 'react-native-scrollable-tab-view';
import IconTabBar from '../components/common/MdIconTabBar';
import LightBox from '../components/lightbox/Lightbox';

const theme = require('../style/theme');


const initialTabIndex = 0;
const initialTab = Tabs.FEED;

// # Tab navigation
class Navigation extends Component {

  componentDidMount() {
    const { changeTab } = this.props;
    changeTab(initialTab)
  }

  @autobind
  onChangeTab({ ref }) {
    this.props.changeTab(ref.props.id);
  }

  render() {
    const { navigator, currentTab, events } = this.props;
    return (
      <View style={{ flex: 1 }}>
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
          <FeedView navigator={navigator} id={Tabs.FEED} tabLabel={{ title: 'Feed', icon: 'looks' }} />
          {false && <CalendarView id={Tabs.CALENDAR} navigator={navigator} tabLabel={{ title: 'Events', icon: 'event' }} />}
          <EventMapView navigator={navigator} id={Tabs.MAP} tabLabel={{ title: 'Map', icon: 'public' }} />
          <ProfileView navigator={navigator} id={Tabs.SETTINGS} tabLabel={{ title: 'Personal', icon:'account-circle' }} />
        </ScrollableTabs>

        <LightBox navigator={this.props.navigator} />
      </View>
    )
  }
}

const mapDispatchToProps = { changeTab };

const select = state => ({
  events: getEvents(state),
  currentTab: state.navigation.get('currentTab')
})

export default connect(select, mapDispatchToProps)(Navigation);
