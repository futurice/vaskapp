import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';

import Text from '../../common/MyText';
import Button from '../../common/Button';
import Callout from '.';
import theme from '../../../style/theme';

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
    paddingBottom: 8
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

const CalloutPost = ({ item }) => {
    return (
      <Callout
        itemId={item.get('id')}
        imageUrl={item.get('imageUrl')}
      >
        <View style={styles.postInfo}>
          <Text style={styles.postAuthorName}>{item.get('title')}</Text>
          <Text style={styles.postTextMessage}>{item.get('subtitle')}</Text>
          <Button style={styles.calloutButton}><MDIcon name="directions" /> Directions</Button>
        </View>
      </Callout>
  );
};

export default CalloutPost;
