
import React from 'react';
import { isFunction } from 'lodash';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import theme from '../../style/theme';
import AnimateMe from '../AnimateMe';

const IOS = Platform.OS === 'ios';
const styles = StyleSheet.create({
  emojiPicker: {
    position: 'absolute',
    left: 5,
    width: IOS ? 44 : 48,
    bottom: 10,
    minHeight: 200,

    borderWidth: 0,
    borderColor: '#ddd',
    borderRadius: 40,
    paddingVertical: 10,
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    elevation: 2,
    shadowColor: theme.secondaryDark,
    shadowOpacity: 0.12,
    shadowRadius: 7,
    shadowOffset: {
      height: 5,
      width: 0
    },
  },
  emojiButtonText: {
    fontSize: IOS ? 25 : 20,
    backgroundColor: 'transparent',
    paddingVertical: 5,
  }
});

const DEFAULT_EMOJIS = ['🙏', '👌', '🍻', '😋', '😍'];

const SimpleEmojiPicker = ({ onEmojiPress, emojis }) => {
  const emojiSelection = emojis || DEFAULT_EMOJIS;

  return (
    <AnimateMe animationType="fade-from-bottom" duration={200}>
      <View style={styles.emojiPicker}>
        {emojiSelection.map((emoji, index) => (
          <View>
            <AnimateMe style={{ flex: 0 }} animationType="fade-from-bottom" duration={200} delay={100}>
              <TouchableOpacity onPress={() => onEmojiPress(emoji)}>
                <Text style={styles.emojiButtonText}>{emoji}</Text>
              </TouchableOpacity>
            </AnimateMe>
          </View>
        ))}
      </View>
    </AnimateMe>
  );
};

export default SimpleEmojiPicker;
