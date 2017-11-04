
import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Text from '../common/MyText';
import ParsedText from 'react-native-parsed-text';
import time from '../../utils/time';
import theme from '../../style/theme';
import AnimateMe from '../AnimateMe';


const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

const CommentAuthor = ({ name, ago, avatar, id, onAuthorPress }) => (
  <View style={styles.authorField}>
    <TouchableOpacity onPress={() => onAuthorPress({ name, id }, avatar)}>
      <Text style={styles.commentAuthor}>{name}</Text>
    </TouchableOpacity>
    <Text style={styles.itemTimestamp}>{ago}</Text>
  </View>
);

const CommentText = ({ text, style }) => (
  <ParsedText
    style={[style, { fontFamily: IOS ? 'Futurice' : 'Futurice-Regular' }]}
    parse={[{
      type: 'url',
      style: { textDecorationLine: 'underline' },
      onPress: (url) => Linking.openURL(url) },
    ]}
  >
    {text}
  </ParsedText>
);



const Comment = ({ item, openUserView }) => {
  const ago = time.getTimeAgo(item.get('createdAt'));
  const profilePicture = item.get('profilePicture');

  const hasImage = !!item.get('imagePath');

  const authorProps = {
    avatar: profilePicture,
    onAuthorPress: openUserView,
    id: item.get('userId'),
    name: item.get('userName'),
    ago: ago,
  };

  return (
    <AnimateMe delay={140} duration={200} animationType="fade-in">
      <View style={styles.comment}>
        <View style={styles.commentContent}>
          <View style={styles.commentAvatarCol}>
            <View style={styles.commentAvatar}>
              {profilePicture
                ? <Image source={{ uri: profilePicture }} style={styles.commentAvatarImage} />
                : <Icon name="person" style={styles.commentAvatarIcon} />
              }
            </View>
          </View>

          <View style={styles.commentTextContent}>

            {hasImage
            ?
              <View>
                <CommentAuthor {...authorProps} />
                <Image style={styles.commentImage} source={{ uri: item.get('imagePath') }} />
              </View>
            :
              <View>
                <CommentAuthor {...authorProps} />
                <CommentText style={styles.commentText} text={item.get('text')} />
              </View>
            }

          </View>
        </View>
      </View>
    </AnimateMe>
  );
};

const CommentPost = ({ item, openUserView }) => {

  if (!item) {
    return null;
  }

  const ago = time.getTimeAgo(item.get('createdAt'));
  const profilePicture = item.getIn(['author', 'profilePicture']);
  const userName = item.getIn(['author', 'name']);
  const userId = item.getIn(['author', 'id']);
  const hasImage = item.get('type') === 'IMAGE';
  const hasText = !!item.get('text')

  const authorProps = {
    avatar: profilePicture,
    onAuthorPress: openUserView,
    id: userId,
    name: userName,
    ago: ago,
  };

  return (
    <AnimateMe delay={0} duration={200} animationType="fade-in">
      <View style={styles.comment}>
        <View style={styles.commentContent}>
          <View style={styles.commentAvatarCol}>
            <View style={styles.commentAvatar}>
              {profilePicture
                ? <Image source={{ uri: profilePicture }} style={styles.commentAvatarImage} />
                : <Icon name="person" style={styles.commentAvatarIcon} />
              }
            </View>
          </View>

          <View style={styles.commentTextContent}>
            {hasImage &&
              <View>
                <CommentAuthor {...authorProps} />
                <Image style={styles.commentImage} source={{ uri: item.get('url') }} />
              </View>
            }
            {hasText &&
              <View style={{ marginTop: hasImage ? 10 : 0, }}>
                {!hasImage && <CommentAuthor {...authorProps} />}
                <CommentText style={styles.commentText} text={item.get('text')} />
              </View>
            }

          </View>
        </View>
      </View>
    </AnimateMe>
  );
};


const styles = StyleSheet.create({
  comment:{
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 15,
    paddingBottom: 10,
  },
  commentContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  commentAvatarCol: {
    paddingRight: 18,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.grey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18
  },
  commentAvatarIcon: {
    top: 0,
    left: 0,
    textAlign: 'center',
    width: 36,
    height: 36,
    borderWidth: 2,
    borderColor: theme.earth1,
    borderRadius: 18,
    color: theme.white,
    fontSize: 36,
    lineHeight: 44,
    backgroundColor: theme.transparent
  },
  commentImage: {
    width: 120,
    height: 120,
    borderRadius: 5,
  },
  commentText: {
    textAlign: 'left',
    color: theme.primary
  },
  commentListItemImg: {
    width: width,
    height: width,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  commentTextContent:{
    flex: 1,
  },
  authorField: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 7,
  },
  commentAuthor: {
    color: theme.primary,
    fontWeight: IOS ? 'bold' : 'normal',
    fontFamily: IOS ? 'Futurice' : 'Futurice_bold',
  },
  itemTimestamp: {
    marginLeft: 12,
    top: IOS ? 2 : 0,
    flex: 1,
    color: '#aaa',
    fontSize: 12,
    fontWeight: 'normal'
  },
});


export {
  Comment,
  CommentPost,
};
