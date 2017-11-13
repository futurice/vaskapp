'use strict';

import React, { Component } from 'react';
import {
  View,
  TouchableNativeFeedback,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native';

import theme from '../../style/theme';

class Button extends Component {
  // propTypes: Object.assign({},
  //   {
  //     textStyle: Text.propTypes.style,
  //     disabledStyle: Text.propTypes.style,
  //     children: PropTypes.string.isRequired,
  //     isDisabled: PropTypes.bool,
  //     onPress: PropTypes.func,
  //     onPressIn: PropTypes.func,
  //     onPressOut: PropTypes.func
  //   },
  // )

  _renderInnerText() {
    return (
      <Text style={[styles.textButton, this.props.textStyle]}>
        {this.props.children}
      </Text>
    );
  }

  render() {
    const { isBusy, isDisabled, style, disabledStyle } = this.props;
    if (isDisabled === true) {
      return (
        <View style={[styles.button, style, (disabledStyle || styles.opacity)]}>
          <Text style={{textAlign:'center'}}>{this._renderInnerText()}</Text>
        </View>
      );
    } else {
      const touchableProps = {
        onPress: this.props.onPress,
        onPressIn: this.props.onPressIn,
        onPressOut: this.props.onPressOut,
      };
      return (
        <View style={[styles.button, style]}>
          <TouchableNativeFeedback {...touchableProps}
            delayPressIn={0}
            background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          >
            <View style={{ flex:1, justifyContent:'center', height: 40 }}>
              {isBusy
                ? <ActivityIndicator size="small" color={theme.secondary} />
                : this._renderInnerText()
              }
            </View>
          </TouchableNativeFeedback>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  button: {
    flex:1,
    height: 50,
    justifyContent: 'center',
    backgroundColor: theme.primary,
    borderRadius: 30,
    paddingLeft: 0,
    paddingRight: 0,
    elevation: 2,
  },
  textButton: {
    alignSelf: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff'
  },
  opacity: {
    opacity: 0.6
  }
});

export default Button;
