import React, { Component } from 'react';
import { isFunction } from 'lodash';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';

import PlatformTouchable from '../common/PlatformTouchable';
import Icon from 'react-native-vector-icons/Ionicons';
import theme from '../../style/theme';

class CommentsLinks extends Component {
  render() {
    const { commentCount, openComments, compact } = this.props;
    const hasComments = commentCount > 0;


    let calloutProps = {};
    if (openComments && isFunction(openComments)) {
      calloutProps = {
        onPress: openComments
      }
    }

    return (
      <PlatformTouchable style={styles.commentLink} {...calloutProps}>
        <View style={styles.comment}>
          {(hasComments || !compact) &&
            <Text style={[styles.commentText, compact && styles.compactText]}>
              {hasComments ? commentCount : ''}
            </Text>
          }
          <Text style={[styles.commentText, !compact && styles.commentTextRight]}>
            <Icon
              style={[styles.commentIcon, hasComments ? styles.activeCommentIcon : {}]}
              name={'md-chatbubbles'}
            />
          </Text>
        </View>
      </PlatformTouchable>
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
  },
  commentTextRight: {
    marginLeft: 7,
  },
  compactText: {
    marginRight: 3
  },
  commentIcon: {
    fontSize: 20,
  },
  activeCommentIcon: {
    color: theme.secondaryLight,
  }
});


export default CommentsLinks;
