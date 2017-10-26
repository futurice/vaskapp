import React from 'react';
import { fromJS } from 'immutable';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { noop } from 'lodash';
import CommentsLink from '../../feed/CommentsLink';

import theme from '../../../style/theme';

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  calloutContent: {
    flex: 1,
    padding: 15,
    paddingBottom: 10,
    alignItems: 'flex-start',
    flexDirection: 'row',
    elevation: 3,
    overflow: 'visible',
  },
  calloutImage: {
    width: 120,
    height: height / 4,
    backgroundColor: theme.white,
  },
  calloutTitleWrap: {
    flexDirection:'row',
  },
  calloutImage: {
    width: 110,
  },
  postImage: {
    width: 110,
    height: 110,
    borderRadius: 3,
  }
});

const Callout = ({ itemId, imageUrl, onImagePress, children }) => {
  return (
    <View style={styles.calloutContent}>
      <View style={styles.calloutImage}>
        <TouchableWithoutFeedback onPress={() => onImagePress(itemId)}>
          <Image
            style={styles.postImage}
            source={{ uri: imageUrl }}
          />
        </TouchableWithoutFeedback>
      </View>
      {children}
    </View>
  );
};

Callout.defaultProps = {
  children: null,
  item: fromJS({}),
  onImagePress: noop
}

export default Callout;
