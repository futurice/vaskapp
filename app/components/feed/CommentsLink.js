import React, { Component } from 'react';
import { isFunction } from 'lodash';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';

import Text from '../common/MyText';
import PlatformTouchable from '../common/PlatformTouchable';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../../style/theme';

const IOS = Platform.OS === 'ios';

class CommentsLinks extends Component {
  render() {
    const { commentCount, openComments, reverse, compact } = this.props;
    const hasComments = commentCount > 0;


    let calloutProps = {};
    if (openComments && isFunction(openComments)) {
      calloutProps = {
        onPress: openComments
      }
    }

    return (
      <TouchableOpacity activeOpacity={0.8} style={styles.commentLink} {...calloutProps}>
        <View style={[styles.comment, reverse && { flexDirection: 'row-reverse' }]}>
          {(hasComments || !compact) &&
            <Text style={[styles.commentText, compact && styles.compactText, reverse && { marginLeft: 10 }]}>
              {hasComments ? commentCount : ''}
            </Text>
          }
          <Text style={[styles.commentText, styles.commentIconWrap, !compact && styles.commentTextRight]}>
            <Icon
              style={[styles.commentIcon, hasComments ? styles.activeCommentIcon : {}]}
              name={'md-chatbubbles'}
            />
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
};


const styles = StyleSheet.create({
  comment: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentText: {
    color: theme.grey,
    fontSize: 15,
    top: IOS ? 3 : 0,
  },
  commentTextRight: {
    marginLeft: 7,
  },
  commentIconWrap: {
    top: 1,
  },
  compactText: {
    marginRight: 3
  },
  commentIcon: {
    fontSize: 19,
  },
  activeCommentIcon: {
    color: theme.secondaryLight,
  }
});


export default CommentsLinks;
