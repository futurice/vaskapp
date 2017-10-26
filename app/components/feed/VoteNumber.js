import React, { Component, PropTypes } from 'react';
import { Animated, Easing } from 'react-native';
import Text from '../common/MyText';


class VoteNumber extends Component {
  constructor(props) {
    super(props);
    this.state = { animation: new Animated.Value(0) }
  }

  componentWillReceiveProps({ value }) {
    if (this.props.value !== value) {
      this.animateNumber();
    }
  }

  animateNumber() {
    const { animation } = this.state;

    Animated.sequence([
      Animated.timing(animation, { toValue: 1, duration: 50 }),
      Animated.timing(animation, { toValue: 0, duration: 300, easing: Easing.elastic(2) })
    ]).start();
  }

  render() {
    const { style, value } = this.props;
    const { animation } = this.state;

    const animationStyles = {
      transform: [{ scale: animation.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]
    };

    return (
      <Animated.Text style={[style, animationStyles]}>
        {value}
      </Animated.Text>
    );
  }
}

module.exports = VoteNumber;
