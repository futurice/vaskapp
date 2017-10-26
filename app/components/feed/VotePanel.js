import React, { Component } from 'react';
import { Animated, Easing, View, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { get } from 'lodash';
import autobind from 'autobind-decorator';

import VoteNumber from './VoteNumber';
import PlatformTouchable from '../common/PlatformTouchable';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';
import Text from '../common/MyText';

const IOS = Platform.OS === 'ios';
const heartIcon = require('../../../assets/icons/love.png');

class VotePanel extends Component {
  constructor(props) {
    super(props);
    this.state = { animation: new Animated.Value(1) }
  }

  componentWillReceiveProps({ item }) {
    const { userVote } = item || {};
    if (get(this.props, 'item.userVote') !== userVote && userVote) {
      this.animateIcon();
    }
  }

  animateIcon() {
    const duration = 50;
    const { animation } = this.state;

    Animated.sequence([
      Animated.timing(animation, { toValue: 0, duration }),
      Animated.timing(animation, { toValue: 1, easing: Easing.elastic(2), duration: duration * 6 })
    ]).start();
  }

  @autobind
  getVotes() {
    const { votes } = this.props.item;
    const voteCount = parseInt(votes, 10);
    return voteCount > 0 ? voteCount : '';
  }

  @autobind
  voteThisItem(vote) {

    const { id } = this.props.item;

    if (this.props.isRegistrationInfoValid === false) {
      this.props.openRegistrationView();
    } else {
      this.props.voteFeedItem(id, vote);
    }
  }

  renderVoteButton() {
    const { userVote } = this.props.item;
    const { animation } = this.state;
    const value = userVote && userVote > 0 ? 0 : 1;
    const alreadyVotedThis = userVote > 0;

    return (
      <View style={styles.itemVoteButtonWrap}>
        <TouchableOpacity
          style={styles.itemVoteButton}
          activeOpacity={0.8}
          onPress={() => this.voteThisItem(value)}>
            <View style={styles.itemVoteButton}>
              <Animated.Image
                source={heartIcon}
                style={[
                  styles.voteImage,
                  { tintColor: alreadyVotedThis ? theme.secondaryLight : theme.grey },
                  { transform: [{ scale: animation }] }
                ]}
              />
            </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {

    return (
      <View style={styles.itemVoteWrapper}>
        {this.renderVoteButton()}
        <View>
          <VoteNumber style={styles.itemVoteValue} value={this.getVotes()} />
        </View>
      </View>
    );
  }
};


const styles = StyleSheet.create({
  itemVoteWrapper: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingLeft: 8,
    marginLeft: 0,
    minWidth: 50,
    minHeight: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemVoteButtonWrap: {
    flex: 1,
    width: 28,
    height: 28,
    top: 1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemVoteButton: {
    flex: 1,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 0,
  },
  itemVoteValue: {
    minWidth: 15,
    textAlign: 'center',
    fontSize: 15,
    top: IOS ? 1 : 0,
    paddingVertical: 3,
    color: theme.grey
  },
  voteImage: {
    height: 22,
    width: 22,
  }
});


export default VotePanel;
