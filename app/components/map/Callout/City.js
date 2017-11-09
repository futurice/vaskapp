import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  Linking,
} from 'react-native';
import MDIcon from 'react-native-vector-icons/MaterialIcons';

import Text from '../../common/MyText';
import Button from '../../common/Button';
import Callout from '.';
import theme from '../../../style/theme';
import locationService from '../../../services/location';

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  postImage: {
    width: 110,
    height: 110,
    borderRadius: 3,
  },
  postInfo: {
    flexGrow: 1,
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
    marginBottom: 15,
    fontSize: 12,
    color: theme.dark,
    backgroundColor: theme.transparent
  },
  calloutButton: {
    top: 12,
    maxHeight: 36,
    maxWidth: 150,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const onDirectionsPress = model => {
  const location = model && model.toJS ? model.toJS() : model;
  const geoUrl = locationService.getGeoUrl(location);

  Linking.openURL(geoUrl);
}

const CalloutPost = ({ item }) => {
    return (
      <Callout
        itemId={item.get('id')}
        imageUrl={item.get('imageUrl')}
      >
        <View style={styles.postInfo}>
          <Text style={styles.postAuthorName}>{item.get('title')}</Text>
          <Text style={styles.postTextMessage}>{item.get('subtitle')}</Text>
          <Button style={styles.calloutButton} onPress={() => onDirectionsPress(item)}>
            Directions
          </Button>
        </View>
      </Callout>
  );
};

export default CalloutPost;
