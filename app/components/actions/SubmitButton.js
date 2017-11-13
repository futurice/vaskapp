'use strict';

import React, { Component } from 'react';

import {
  View,
  Animated,
  Text,
  Platform,
  Easing,
  TouchableWithoutFeedback,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import autobind from 'autobind-decorator';

import AnimateMe from '../AnimateMe';
import Button from '../common/Button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import theme from '../../style/theme';
const IOS = Platform.OS === 'ios';

class SubmitButton extends Component {
  @autobind
  renderText() {

    const { isReady, children } = this.props;

    // if (isReady) {
    //   return (
    //     <Text style={styles.okIcon}>
    //       <Icon size={30} name={'done'} />
    //     </Text>
    //   )
    // }

    return <Text>{children}</Text>;
  }

  render() {
    return (
      <Button
        onPress={this.props.onPress}
        style={styles.button}
        textStyle={{ color: theme.secondaryClear }}
        isDisabled={this.props.isDisabled}
        isBusy={this.props.isLoading}
      >
        {this.renderText()}
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
    elevation: 2,
    marginBottom: IOS ? 0 : 20,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      height: 7,
      width: 0
    },
    flex: 1,
    backgroundColor: theme.white,
  },
  okIcon: {
    fontSize: 30,
  }
});

export default SubmitButton;
