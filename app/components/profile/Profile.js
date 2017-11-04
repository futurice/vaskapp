'use strict';

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  Dimensions,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import Icon from 'react-native-vector-icons/MaterialIcons';
import WebViewer from '../webview/WebViewer';
import Text from '../common/MyText';
import theme from '../../style/theme';
import { getProfileLinks } from '../../concepts/settings';
import { getApps } from '../../concepts/apps';
import { getCurrentCityName } from '../../concepts/city';
import {
  openRegistrationView,
  getUserName,
  getUserInfo,
  getUserImage,
  getUserTeam,
} from '../../concepts/registration';
import feedback from '../../services/feedback';

import ProfileLink from './ProfileLink';
import AppList from './AppList';
import ImageSection from './ImageSection';
import { links } from '../../constants/Links';
import { getNameInitials } from '../../utils/name-format';


const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.stable,
  },
  scrollView:{
    flex: 1,
  },
  listItem: {
    flex: 1,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: IOS ? theme.white : theme.transparent,
  },
  listItem__hero:{
    flexGrow: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    paddingTop: 0,
    paddingBottom: 0,
    backgroundColor: theme.white,
    flex: 1,
  },
  heroItem: {
    height: IOS ? 230 : 220,
    marginBottom: 20,
    flex: 0,
  },
  heroInfoContent: {
    flexDirection: 'column',
    alignItems: 'center'
  },
  listItemSeparator: {
    marginBottom: 20,
    elevation: 2,
    borderBottomWidth: 0,
    backgroundColor: theme.white,
    borderBottomColor: '#eee',
    shadowColor: theme.secondaryDark,
    shadowOpacity: 0.06,
    shadowRadius: 7,
    shadowOffset: {
      height: 5,
      width: 0
    },
  },
  listItemLast: {
    marginBottom: IOS ? 70 : 20,
  },
  listItemButton:{
    backgroundColor: IOS ? theme.transparent : theme.white,
    flex: 1,
    padding: 0,
  },
  listItemIcon: {
    fontSize: 22,
    color: theme.blue2,
    alignItems: 'center',
    width: 50,
  },

  listItemText:{
    color: '#000',
    fontSize: 16,
    marginTop: IOS ? 5 : 0,
  },
  listItemText__highlight: {
    color: theme.primary,
    fontWeight: 'normal',
    backgroundColor: theme.transparent,
    padding: 0,
    paddingTop: 10,
    top: 0,
    fontSize: 16,
  },
  listItemText__small: {
    fontSize: 13,
    color: theme.grey
  },
  profilePicWrap:{
    backgroundColor: theme.stable,
    borderRadius: 50,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileInitials: {
    fontSize: 34,
    top: IOS ? 7 : 0,
    color: theme.dark,
  },
  profileEditBadge: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: IOS ? theme.secondaryLayer : 'rgba(255,255,255,.5)',
  },
  profileEditText: {
    fontSize: 11,
    fontWeight: IOS ? 'bold' : 'normal',
    backgroundColor: theme.transparent,
    textAlign: 'center',
    color: IOS ? theme.white : theme.primary,
  },
});

class Profile extends Component {

  @autobind
  onLinkPress(url, text, openInWebview) {
    if (!url) {
      return;
    }
    if (!openInWebview) {
      Linking.openURL(url)
    } else {
      this.props.navigator.push({
        component: WebViewer,
        showName: true,
        name: text,
        url: url
      });
    }
  }

  renderAppList(item, index) {
    return (
      <AppList
        navigator={this.props.navigator}
        apps={item.apps}
        title={item.title}
        key={index}
      />
    );
  }

  renderLinkItem(item, index) {
    const onPress = () => {
      return item.mailto
        ? feedback.sendEmail(item.mailto)
        : this.onLinkPress(item.link, item.title, item.showInWebview)
    }

    return <ProfileLink item={item} index={index} onPress={onPress} />;
  }

  renderComponentItem(item, index) {
    const { navigator } = this.props;
    const { component, title } = item;

    const onPress = () => navigator.push({ name: title, component, showName: true });

    return <ProfileLink item={item} index={index} onPress={onPress} />;
  }

  renderModalItem(item, index) {
    const currentTeam = this.props.selectedTeam;
    const avatar = item.picture;

    return (
      <View key={index} style={[styles.listItemButton, styles.listItemSeparator, styles.heroItem]}>
        <View style={[styles.listItem, styles.listItem__hero]}>

          <View>
            <TouchableOpacity onPress={this.props.openRegistrationView}>
              <View style={styles.profilePicWrap}>
                {avatar
                  ? <Image style={styles.profilePic} source={{ uri: avatar }} />
                  : <Text style={styles.profileInitials}>{getNameInitials(item.title)}</Text>
                }
                <View style={styles.profileEditBadge}>
                  <Text style={styles.profileEditText} bold>EDIT</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.heroInfoContent}>
            <Text style={[styles.listItemText, styles.listItemText__highlight]}>
              {item.title || 'Anonymous User'}
            </Text>
            <Text style={[styles.listItemText, styles.listItemText__small]}>
              {!!currentTeam && currentTeam.get('name')}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  @autobind
  renderItem(item) {
    const key = item.id || item.title;

    if (item.component) {
      return this.renderComponentItem(item, key);
    } else if (item.link || item.mailto) {
      return this.renderLinkItem(item, key);
    } else if (item.id === 'profile') {
      return this.renderModalItem(item, key);
    } else if (item.id === 'apps') {
      return this.renderAppList(item, key);
    } else if (item.id === 'images') {
      return <ImageSection navigator={this.props.navigator} title={item.title} key={key}/>
    }

    return null;
  }

  render() {
    const { name, picture, cityName, apps } = this.props;

    const sections = [
    {
      title: name,
      icon: 'face',
      id: 'profile',
      picture
    },
    {
      title: 'My Apps',
      id: 'apps',
      apps,
    },
    {
      title: 'My Images',
      id: 'images',
    },
    {
      link: 'https://futurice.github.io/vaskapp-web/apps/Initiative/',
      title: 'Initiate',
      subtitle: 'Do you have an idea? Or maybe too complex 3x2 decision? Let us know!',
      id: 'feedback',
      icon: 'lightbulb-outline',
      showInWebview: true,
    }
    ]

    const listData = sections; //.concat(links);

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {listData.map(this.renderItem)}
        </ScrollView>
      </View>
      );

  }
}

const select = state => ({
  name: getUserName(state),
  info: getUserInfo(state),
  selectedTeam: getUserTeam(state),
  picture: getUserImage(state),

  apps: getApps(state),
  cityName: getCurrentCityName(state),
});

const mapDispatchToProps = { openRegistrationView };

export default connect(select, mapDispatchToProps)(Profile);
