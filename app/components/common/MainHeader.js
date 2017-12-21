'use strict';

import React, { PropTypes, Component } from 'react';
import { ToolbarAndroid, StyleSheet } from 'react-native';
import autobind from 'autobind-decorator';

import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';
import Tabs from '../../constants/Tabs';
import SortTypes from '../../constants/SortTypes';
import { openSettings, openConversations } from '../../services/router';

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: theme.white,
    elevation: 0,
    height: 56,
  }
});

const logo = require('../../../assets/logo/vaskapp.png');
const iconColor = theme.primary;
const selectedActionIcon = '‣'; //‣ • ● ♥
const unreadConversationsIcon = require('../../../assets/icons/conversation-alert.png');
const conversationsIcon = require('../../../assets/icons/conversation.png');

const getElevation = (tab) => {
  switch (tab) {
    case Tabs.FEED:
    case Tabs.MAP:
    case Tabs.SETTINGS: {
      return 0;
    }

    default: {
      return 0;
    }
  }
};

const getActions = (tab, { sortType, unreadMessages }) => {
  switch (tab) {
    case Tabs.FEED: {
      return [
        { title: `${sortType === SortTypes.SORT_NEW ? selectedActionIcon : '  '} 🌟 NEW`, id: SortTypes.SORT_NEW, show: 'never' },
        { title: `${sortType === SortTypes.SORT_HOT ? selectedActionIcon : '  '} 🔥 HOT`, id: SortTypes.SORT_HOT, show: 'never' },
        {
          title: 'Conversations',
          id: 'conversations',
          show: 'always',
          iconName: 'chat',
          icon: !!unreadMessages ? unreadConversationsIcon : conversationsIcon
        },
      ];
    }
    case Tabs.SETTINGS: {
      return [{ title: 'Settings', id: 'gear', show: 'always', iconName: 'settings', icon: require('../../../assets/icons/gear.png') }]
    }
    default: {
      return [];
    }
  }
  return [];
};

class MainHeader extends Component {
  @autobind
  onActionSelected(position) {
    const { currentTab, navigator } = this.props;

    if (currentTab === Tabs.SETTINGS && position === 0) {
      openSettings(navigator);
      return;
    }

    if (currentTab === Tabs.FEED) {
      switch (position) {
        case 0: {
          this.props.setFeedSortType(SortTypes.SORT_NEW);
          break;
        }
        case 1: {
          this.props.setFeedSortType(SortTypes.SORT_HOT);
          break;
        }
        case 2: {
          openConversations(navigator);
        }

        default: {
          console.log('No action for this selection');
          break;
        }
      }
    }

    return;
  }

  render() {
    const toolbarStyles = [styles.toolbar];

    const {
      backgroundColor,
      titleColor,
      currentTab,
      selectedSortType,
      unreadConversationCount,
    } = this.props;

    const elevation = 0; // getElevation(currentTab);
    if (backgroundColor) {
      toolbarStyles.push({ backgroundColor, elevation })
    }

    return (
      <ToolbarAndroid
        actions={getActions(currentTab, { sortType: selectedSortType, unreadMessages: unreadConversationCount })}
        logo={logo}
        // overflowIconName={'sort'}
        // title={''}
        overflowIcon={require('../../../assets/icons/sort.png')}
        onActionSelected={this.onActionSelected}
        iconColor={theme.grey4}
        titleColor={titleColor || theme.primary}
        style={toolbarStyles}
      />
    );
  }
}

export default MainHeader;
