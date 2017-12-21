
import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Platform,
  Dimensions,
} from 'react-native';
import { Map } from 'immutable';
import { noop } from 'lodash';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Text from '../common/MyText';
import AnimateMe from '../AnimateMe';
import PlatformTouchable from '../common/PlatformTouchable';

import time from '../../utils/time';
import theme from '../../style/theme';
import typography from '../../style/typography';

const { width } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';
const textMaxLength = 40;

const Conversation = ({ item, last, showDelay, onPress }) => {
  const profilePicture = item.getIn(['author', 'profilePicture']);

  const isCommentImage = item.getIn(['comment', 'image']);

  return (
    <AnimateMe delay={showDelay} animationType={'fade-from-bottom'}>
    <PlatformTouchable activeOpacity={0.7} delayPressIn={1} onPress={() => onPress(item.get('id'))}>
      <View style={styles.container}>
        {item.get('new') && <View style={styles.newIndicator} />}
        <View style={styles.avatar}>
        {profilePicture
          ? <Image source={{ uri: profilePicture }} style={styles.avatarImage} />
          : <Icon name="person" style={styles.avatarIcon} />
        }
        </View>

        <View style={[styles.contentCol, last ? styles.last : {}]}>
          <View style={styles.content}>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.textMessage}>
              <Text style={styles.author} bold>{item.getIn(['author', 'name'])} </Text>
              {item.get('type') === 'IMAGE' && '📷 '}{item.get('text')}
            </Text>

            <View style={{ flex: 1, paddingRight: 50, }}>
              <Text numberOfLines={1} ellipsizeMode={'tail'} style={[styles.textMessage, styles.commentMessage]}>
                <Icon name="format-quote" style={styles.commentIcon} />
                <Text style={styles.commentAuthor}>{item.getIn(['comment', 'name'])}: </Text>
                {isCommentImage ? '  📷' : item.getIn(['comment', 'text'])}
              </Text>
              <View style={{ position: 'absolute', right: 0, top: 2 }}>
                <Text style={[styles.textMessage, styles.commentMessage, { textAlign: 'right' }]}>
                  {time.getDateAgo(item.getIn(['comment', 'createdAt']))}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </PlatformTouchable>
    </AnimateMe>
  )
};

Conversation.defaultProps = {
  item: Map(),
  last: false,
  onPress: noop,
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.white,
    paddingHorizontal: 20,
    minHeight: 50,

    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.grey1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18
  },
  avatarIcon: {
    top: 0,
    left: 0,
    textAlign: 'center',
    width: 36,
    height: 36,
    borderWidth: 0,
    borderColor: theme.grey1,
    borderRadius: 18,
    color: theme.secondaryLight,
    fontSize: 30,
    lineHeight: IOS ? 40 : 33,
    backgroundColor: theme.transparent
  },
  contentCol: {
    borderBottomWidth: 1,
    borderBottomColor: theme.grey1,
    marginLeft: 15,
    paddingVertical: 20,
    overflow: 'hidden',
    width: width - 97,
  },
  content: {
    padding: 0,
  },
  last: {
    borderBottomWidth: 0,
  },
  author: {
    fontSize: 13,
    marginTop: IOS ? 3 : 0,
    marginBottom: IOS ? 0 : 3,
    color: theme.black,
  },
  textMessage: {
    color: theme.grey4,
    fontSize: 13,
    marginTop: 1,
    minHeight: 20,
  },
  commentMessage: {
    paddingLeft: 0,
  },
  commentIcon: {
    color: '#ccc',
    fontSize: 16,
  },
  newIndicator: {
    backgroundColor: theme.red,
    position: 'absolute',
    left: 10,
    top: 40,
    width: 6,
    height: 6,
    borderRadius: 3,
    zIndex: 10,
  }

});

export default Conversation;