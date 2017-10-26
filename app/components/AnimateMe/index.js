import React, { Component, PropTypes } from 'react';
import { Animated, Platform, View } from 'react-native';

const IOS = Platform.OS === 'ios';

const getAnimationStyles = (type, animation) => {
  switch(type) {
    case 'fade-in':
      return { opacity: animation }

    case 'scale-in':
      return { transform: [{ scale: animation }] };

    case 'scale-small-in':
      return { transform: [{ scale: animation.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.85, 1.2, 1] }) }] };

    case 'fade-from-bottom': {
      return {
        opacity: animation,
        transform: [{ translateY: animation.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
      };
    }

    case 'fade-from-right': {
      return {
        opacity: animation,
        transform: [{ translateX: animation.interpolate({ inputRange: [0, 1], outputRange: [-5, 0] }) }],
      };
    }
  }
}

class AnimatedComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { animation: new Animated.Value(0) }
  }

  componentDidMount() {
    setTimeout(() => {
      Animated.timing(
        this.state.animation,
        { toValue: 1, duration: this.props.duration }
      ).start();
    }, this.props.delay);
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
  animationType: PropTypes.oneOf(['fade-in', 'scale-in', 'fade-from-bottom']),
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
