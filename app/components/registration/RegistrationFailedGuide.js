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

export default RegistrationFailedGuide = ({ onClose }) => (
  <AnimateMe style={styles.container} animationType="drop-in" duration={400}>
    <View style={styles.closeIcon} >
      <TouchableOpacity onPress={onClose}>
        <Icon name="close" style={styles.closeIconText} />
      </TouchableOpacity>
    </View>
    <View style={styles.content}>
      <Text style={styles.h1}>Why did the Login fail?</Text>
      <Text style={styles.paragraph}>App is currently in beta and login is limited to companies. Did you use your company email address?</Text>
      <Text style={styles.paragraph}>You did and still not working? Contact us!</Text>

      <Button style={styles.button} onPress={() => feedback.sendEmail(null, 'Vask Help Request')}>
        Request for Help
      </Button>
    </View>
  </AnimateMe>
);


const styles = StyleSheet.create({
  container: {
    width: width - 0,
    minHeight: height,
    top: 0,
    padding: 25,
    paddingTop: 70,
    backgroundColor: '#FFF',
    borderRadius: 3,
    position: 'absolute',
    left: 0,
    zIndex: 99,
    elevation: 3,
    shadowColor: theme.secondaryDark,
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: {
      height: 15,
      width: 0
    },
  },
  content: {
    flex: IOS ? 1 : 0,
    justifyContent: 'center',
    paddingTop: IOS ? 0 : 50,
  },
  closeIcon: {
    position: 'absolute',
    right: 15,
    top: 50,
    zIndex: 99,
  },
  closeIconText: {
    fontSize: 30,
    color: theme.midgrey,
  },
  h1: typography.h1({ textAlign: 'center', marginBottom: 20, }),
  paragraph: typography.paragraph({ marginBottom: 10, textAlign: 'center' }),
  button: {
    marginTop: 20,
  }
});

