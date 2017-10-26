'use strict';

import React, { Component } from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import Notification from '../components/common/Notification';
import Fab from '../components/common/Fab';
import AnimateMe from '../components/AnimateMe';
import theme from '../style/theme';
import autobind from 'autobind-decorator';
import { openRegistrationView } from '../concepts/registration';
import { getCurrentCityName } from '../concepts/city';
import Icon from 'react-native-vector-icons/MaterialIcons';

const IOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');


const moodIcons = [
  "sentiment-very-dissatisfied",
  "sentiment-dissatisfied",
  "sentiment-neutral",
  "sentiment-satisfied",
  "sentiment-very-satisfied",
]

const moodEmojis = ["😭","🙁","😑","😋","😍"]

class MoodView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emojiAnimations: moodEmojis.map(() => new Animated.Value(0)),
      selectedMood: null
    };

  }


  render() {
    const { cityMoodData, ownMoodData, teamMoodData, limitLineData, moodKpiValues,
      isNotificationVisible, notificationText, cityName, teamName, isLoading } = this.props;


    // this.state.emojiAnimations.forEach(() => )

    return (
      <View style={styles.container} >

        <View style={{ flex: 1, justifyContent: 'space-around', paddingHorizontal: 30, alignItems: 'center', flexDirection: 'row', width, }}>
          <View style={{ height: 3, flex: 1, left: 50, right: 50, position: 'absolute', backgroundColor: '#FFD336' }} />
          {moodEmojis.map((icon, index) =>
            <TouchableOpacity key={icon} activeOpacity={1} onPress={() => this.setState({ selectedMood: index })}>
              {this.state.selectedMood !== index &&
                <Text style={{ fontSize: 30, paddingHorizontal: 0, backgroundColor: '#FFF' }}>
                 {icon}
                </Text>
              }

              {this.state.selectedMood === index &&
                <AnimateMe animationType="scale-small-in" duration={200}>
                  <Text style={{ fontSize: 60, paddingHorizontal: 0, backgroundColor: 'transparent' }}>
                   {icon}
                  </Text>
                </AnimateMe>
              }

             {/*<Icon
                name={icon}
                style={{ color: this.state.selectedMood === index ? theme.secondary : theme.grey3, fontSize: 44, padding: 0, backgroundColor: '#FFF' }} />
              */}
            </TouchableOpacity>
          )}
        </View>
      {/*
        <Fab
          onPress={this.navigateToMoodSlider}
          styles={styles.button}
          disabled={false}
          underlayColor={theme.white}
        >
          <Text style={styles.buttonText}>
            ADD VIBE
          </Text>
        </Fab>
      */}

        <Notification visible={isNotificationVisible} topOffset={IOS ? 20 : 0}>
          {notificationText}
        </Notification>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: IOS ? 20 : 0,
    backgroundColor: theme.white,
  },
  loader: {
    width: 50,
    position: 'absolute',
    zIndex: 3,
    left: width / 2 - 25,
    top: 50,
  },
  button: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    position: 'absolute',
    top: IOS ? (height / 2.5) - 20 : (height / 2.75) - 40,
    zIndex: 2,
    left: (width / 2) - 40,
    backgroundColor: theme.white,
    width: 80,
    height: 80,
    borderRadius: 40,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.15,
    shadowRadius: 1,
    shadowOffset: {
      height: 2,
      width: 0
    },
  },
  buttonSmall: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    position: 'absolute',
    right: 25,
    zIndex: 2,
    top: IOS ? (height / 2.5) - 0 : (height / 2.75) - 20,
    backgroundColor: theme.stable,
    width: 40,
    height: 40,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 1,
    shadowOffset: {
      height: 2,
      width: 0
    },
  },
  smallButtonText: {
    color: theme.midgrey,
    backgroundColor: 'transparent',
    textAlign: 'center',
    padding: 9,
  },
  buttonText: {
    color: theme.secondary,
    backgroundColor: 'transparent',
    textAlign: 'center',
    padding: 10,
    fontSize: 16,
  }
});

const mapDispatchToProps = { openRegistrationView };

const mapStateToProps = state => {
  const isRegistrationInfoValid = state.registration.get('name') !== '' &&
    state.registration.get('selectedTeam') > 0;
  return {
    isNotificationVisible: state.competition.get('isNotificationVisible'),
    notificationText: state.competition.get('notificationText'),
    isRegistrationInfoValid
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(MoodView);

