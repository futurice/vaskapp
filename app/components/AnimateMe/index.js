import React, { Component, PropTypes } from 'react';
import { Animated, Platform, View, Dimensions } from 'react-native';
import autobind from 'autobind-decorator';
import { noop } from 'lodash';

const IOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');

const getAnimationStyles = (type, animation) => {
  switch(type) {
    case 'fade-in':
      return { opacity: animation }

    case 'scale-in':
      return { transform: [{ scale: animation }] };

    case 'drop-in':
      return {
        opacity: animation,
        transform: [{ scale: animation.interpolate({ inputRange: [0, 1], outputRange: [1.05, 1] }) }]
      };

    case 'shake':
      return {
        transform: [
          { scale: animation.interpolate({ inputRange: [0, 1], outputRange: [1.025, 1] }) },
          { rotate: animation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '3deg'] }) },
        ]
      };

    case 'shake2':
      return {
        transform: [
          { scale: animation.interpolate({ inputRange: [0, 1], outputRange: [1.01, 1] }) },
          { rotate: animation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-1deg'] }) },
          { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [0, -2] }) },
        ]
      };

    case 'shake3':
      return {
        transform: [
          { scale: animation.interpolate({ inputRange: [0, 1], outputRange: [1, 1.015] }) },
          { rotate: animation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '4deg'] }) },
          { translateX: animation.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }) },
          { translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [0, -2] }) },
        ]
      };

    case 'scale-small-in':
      return { transform: [{ scale: animation.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.85, 1.2, 1] }) }] };

    case 'fade-from-bottom': {
      return {
        opacity: animation,
        transform: [{ translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
      };
    }

    case 'fade-from-top': {
      return {
        opacity: animation,
        transform: [{ translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }],
      };
    }

    case 'fade-from-left': {
      return {
        opacity: animation,
        transform: [{ translateX: animation.interpolate({ inputRange: [0, 1], outputRange: [-5, 0] }) }],
      };
    }
    case 'fade-from-right': {
      return {
        opacity: animation,
        transform: [{ translateX: animation.interpolate({ inputRange: [0, 1], outputRange: [5, 0] }) }],
      };
    }
    case 'comment-image': {
      return {
        opacity: animation,
        transform: [
          { scale: animation.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) },
          { translateX: animation.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] }) }
        ]
      };
    }
  }
}

class AnimatedComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { animation: new Animated.Value(0) }
  }

  animationRepeater = null
  componentDidMount() {
    this.animationRepeater = true;
    setTimeout(this.startAnimation, this.props.delay);
  }

  componentWillUnmount() {
    if (this.animationRepeater) {
      this.animationRepeater = null
    }
  }

  @autobind
  startAnimation() {
    const next = this.props.infinite && this.animationRepeater ? this.repeatAnimation : noop;
    Animated.timing(
      this.state.animation,
      { toValue: 1, duration: this.props.duration }
    ).start(next);
  }

  @autobind
  repeatAnimation() {
    if (!this.state || !this.state.animation) {
      return;
    }

    Animated.timing(
      this.state.animation,
      { toValue: 0, duration: this.props.duration }
    ).start(this.startAnimation);
  }

  render() {
    const { animationType, style, children } = this.props;
    const { animation } = this.state;

    const animationStyles = getAnimationStyles(animationType, animation)

    return (
      <Animated.View style={[{ flex: IOS ? 0 : 1 }, style, animationStyles]}>
        {children}
      </Animated.View>
    );
  }
}

AnimatedComponent.PropTypes = {
  animationType: PropTypes.oneOf([
    'fade-in',
    'scale-in',
    'fade-from-bottom',
    'fade-from-right'
  ]),
  children: PropTypes.node,
  delay: PropTypes.number,
  duration: PropTypes.number,
}

AnimatedComponent.defaultProps = {
  children: null,
  delay: 0,
  duration: 500,
  animationType: 'fade-in',
}

module.exports = AnimatedComponent;
