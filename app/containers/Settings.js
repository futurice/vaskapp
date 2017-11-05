
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
import _ from 'lodash';

import Icon from 'react-native-vector-icons/MaterialIcons';
import WebViewer from '../components/webview/WebViewer';
import PlatformTouchable from '../components/common/PlatformTouchable';
import Button from '../components/common/Button';
import Text from '../components/common/MyText';
import ScrollHeader from '../components/common/ScrollHeader';
import SettingsLink from '../components/profile/SettingsLink';

import { openRegistrationView, getUserName, getUserInfo } from '../concepts/registration';
import { logoutUser } from '../concepts/auth';
import feedback from '../services/feedback';
import { terms, support } from '../constants/Links';

import theme from '../style/theme';
import typography from '../style/typography';

const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

const settingsGroups = [
  { name: 'General' },
  { name: 'Support', links: support },
  { name: 'Terms', links: terms },
];

class Settings extends Component {

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

  renderCustomItem(item, index) {
    return (
      <View style={styles.customButtonWrap}>
        <Button
          key={index}
          underlayColor={theme.secondary}
          activeOpacity={0.9}
          delayPressIn={0}
          onPress={item.onPress}
          style={styles.customButton}
        >
          <Text>{item.title}</Text>
        </Button>
      </View>
    );
  }

  renderLinkItem(item, index) {
    const onPress = () => {
      return item.mailto
        ? feedback.sendEmail(item.mailto)
        : this.onLinkPress(item.link, item.title, item.showInWebview)
    }

    return <SettingsLink item={item} index={index} onPress={onPress} />;
  }

  renderFunctionItem(item, index) {
    const { component, title, onPress } = item;
    return <SettingsLink item={item} index={index} onPress={onPress} />;
  }


  renderComponentItem(item, index) {
    const { navigator } = this.props;
    const { component, title } = item;

    const onPress = () => navigator.push({ name: title, component, showName: true });

    return <SettingsLink item={item} index={index} onPress={onPress} />;
  }

  @autobind
  renderSettingsGroup({ name, links }) {
    return (
      <View style={styles.group}>
        <View style={styles.groupTitle}>
          <Text style={styles.groupTitleText}>{name}</Text>
        </View>

        <View style={styles.groupList}>
          {links.map(this.renderItem)}
        </View>
      </View>
    );
  }

  @autobind
  renderItem(item) {
    if (item.hidden) {
      return null;
    }

    const key = item.id || item.title;
    if (item.component) {
      return this.renderComponentItem(item, key);
    } else if (item.onPress) {
      return this.renderFunctionItem(item, key)
    } else if (item.link || item.mailto) {
      return this.renderLinkItem(item, key);
    } else if (item.id === 'profile') {
      return this.renderModalItem(item, key);
    }

    return null;

  }

  render() {
    const { logoutUser } = this.props;

    const generalLinks = [
      {
        onPress: this.props.openRegistrationView,
        title: 'Edit profile',
        link: 'https://github.com/futurice/vaskapp',
        icon: 'create'
      }
    ];
    const sections = settingsGroups;
    sections[0].links = generalLinks;

    const logoutItem = {
      title: 'LOG OUT',
      onPress: () => logoutUser(),
      separatorAfter: true,
    }

    return (
      <View style={styles.container}>
        {!IOS &&
          <ScrollHeader
            icon={'arrow-back'}
            onIconClick={() => this.props.navigator.pop()}
            title={'Settings'}
            elevation={0}
          />
        }

        <ScrollView style={styles.scrollView}>
          {sections.map(this.renderSettingsGroup)}
          {this.renderCustomItem(logoutItem, 'logout')}
        </ScrollView>

      </View>
      );

  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.stable,
  },
  scrollView:{
    flex: 1,
  },
  group: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.white,
    marginBottom: 20,
    paddingVertical: 20,
    elevation: 2,
    shadowColor: theme.secondaryDark,
    shadowOpacity: 0.06,
    shadowRadius: 7,
    shadowOffset: {
      height: 5,
      width: 0
    },
  },
  groupTitle: {
    padding: 20,
    paddingBottom: 15,
    paddingTop: IOS ? 15 : 5,
    top: IOS ? 3 : 0,
  },
  groupTitleText: typography.h1(),
  groupList: {
    backgroundColor: theme.white,
  },
  customButtonWrap: {
    flex: 1,
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  customButton: {
    height: 40,
    width: 200,
  }
});


const select = store => ({});
const mapDispatchToProps = { openRegistrationView, logoutUser };

export default connect(select, mapDispatchToProps)(Settings);
