import React from 'react';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';

import Text from '../../common/MyText';
import CommentsLink from '../../feed/CommentsLink';
import Callout from '.';
import CalloutButton from './CalloutButton';
import theme from '../../../style/theme';
import time from '../../../utils/time';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  postImage: {
    width: 110,
    height: 110,
    borderRadius: 3,
  },
  postInfo: {
    flex: 1,
    marginLeft: 20,
    maxWidth: width - 130 - 0,
  },
  postAuthorName: {
    fontWeight: '500',
    color: theme.primary,
    fontSize: 14,
    paddingBottom: 3,
  },
  postTextMessage: {
    marginTop: 10,
    fontSize: 12,
    color: theme.dark,
    backgroundColor: theme.transparent
  },
  postDate: {
    marginTop: 10,
    fontSize: 12,
    color: '#888',
    backgroundColor: theme.transparent
  },
});

const MAX_TEXT_LENGTH = 101; // *Tweet*

const CalloutPost = ({ item, openComments, onImagePress }) => {

    const text = item.get('text');
    return (
      <Callout
        onImagePress={onImagePress}
        itemId={item.get('id')}
        imageUrl={item.get('url')}
      >
        <View style={styles.postInfo} >
          <CalloutButton onPress={() => openComments(item.get('id'))}>
            <CommentsLink
              parentId={item.get('id')}
              commentCount={item.get('commentCount')}
              openComments={() => openComments(item.get('id'))}
              compact
            />
          </CalloutButton>

          <Text style={styles.postAuthorName}>{item.getIn(['author','name'])}!</Text>
          <Text style={styles.postTextMessage}>
            {text && text.length > MAX_TEXT_LENGTH ? `${text.slice(0, MAX_TEXT_LENGTH)}...` : text}
          </Text>
          <Text style={styles.postDate}>{time.getTimeAgo(item.getIn(['createdAt']))}</Text>

        </View>
      </Callout>
  );
};

export default CalloutPost;
