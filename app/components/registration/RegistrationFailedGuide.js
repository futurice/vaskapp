import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Text from '../common/MyText';
import Button from '../common/Button';
import theme from '../../style/theme';
import typography from '../../style/typography';
import AnimateMe from '../AnimateMe';
import feedback from '../../services/feedback';

const { width, height } = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

export default RegistrationFailedGuide = ({ onPress }) => (
  <AnimateMe style={styles.container} animationType="drop-in" duration={400}>


    <View style={styles.closeIcon} >
      <TouchableOpacity onPress={onPress}>
          <Icon name="close" style={styles.closeIconText} />
      </TouchableOpacity>
    </View>
    <View style={styles.content}>
      <Text style={styles.h1}>Why did my login fail?</Text>
      <Text style={styles.paragraph}>App is currently in beta and only limited companies have access.</Text>
      <Text style={styles.paragraph}>Do you wanna try Vask? Contact us!</Text>

      <Button style={styles.button} onPress={() => feedback.sendEmail(null)}>
        Request access
      </Button>
    </View>
  </AnimateMe>
);


const styles = StyleSheet.create({
  container: {
    width: width - 40,
    minHeight: height - 60,
    top: 30,
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 3,
    position: 'absolute',
    left: 20,
    zIndex: 99,
    elevation: 10,
    shadowColor: theme.secondaryDark,
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: {
      height: 15,
      width: 0
    },
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  closeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
    zIndex: 99,
  },
  closeIconText: {
    fontSize: 30,
    color: theme.midgrey,
  },
  h1: typography.h1({ textAlign: 'center' }),
  paragraph: typography.paragraph({ marginVertical: 12, textAlign: 'center'  }),
  button: {
    marginTop: 20,
  }
});

