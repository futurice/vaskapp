
import React, { Component, PropTypes } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { List } from 'immutable';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';

import { fetchConversations, getConversationsData } from '../concepts/conversations';
import ConversationRow from '../components/Conversation';
import EmptyState from '../components/Conversation/EmptyState';
import { openComments } from '../concepts/comments';
import CommentsView from '../components/comment/CommentsView';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Text from '../components/common/MyText';
import ScrollHeader from '../components/common/ScrollHeader';

import theme from '../style/theme';
import typography from '../style/typography';

const IOS = Platform.OS === 'ios';

class Conversations extends Component {

  componentDidMount() {
    this.props.fetchConversations();
  }

  @autobind
  openConversation(postId) {
    this.props.openComments(postId);
    this.props.navigator.push({ component: CommentsView, name: 'Comment', showName: true });
  }

  renderLoader() {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    )
  }

  renderContent() {
    const { conversations, isLoading, navigator } = this.props;
    if (isLoading) {
      return this.renderLoader();
    }

    if (!conversations.size) {
      return <EmptyState />
    }

    return (
      <ScrollView>
      {conversations.map((row, index) =>
        <ConversationRow
          item={row}
          showDelay={(index + 1) * 100}
          last={index === conversations.size - 1 }
          onPress={this.openConversation}
        />
      )}
      </ScrollView>
    );
  }

  render() {
    const { conversations, isLoading, navigator } = this.props;
    return (
      <View style={styles.container}>
        {!IOS &&
          <ScrollHeader
            icon={'arrow-back'}
            onIconClick={() => navigator.pop()}
            title={'Your Comments'}
            elevation={0}
          />
        }

        {this.renderContent()}
      </View>
    );
  }
}

Conversations.defaultProps = {
  conversations: List(),
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.white,
    paddingTop: IOS ? 20 : 0,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});


const mapDispatchToProps = { fetchConversations, openComments };

export default connect(getConversationsData, mapDispatchToProps)(Conversations);
