'use strict';

import React, { Component, PropTypes } from 'react';
import {
  View,
  ScrollView,
  Modal,
  StyleSheet
} from 'react-native';

import { isNil } from 'lodash';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Team from './Team';
import Text from '../common/MyText';
import Fab from '../common/Fab';
import AnimateMe from '../AnimateMe';
import theme from '../../style/theme';
import typography from '../../style/typography';

import {
  putUser,
  selectTeam,
  isUserLoggedIn,
  getUser,
  isLoginTeamSelectorOpen,
} from '../../concepts/registration';
import { saveInitialTeamSelection } from '../../concepts/auth';
import { getTeams } from '../../reducers/team';
import Icon from 'react-native-vector-icons/MaterialIcons';

class TeamSelector extends Component {
  render() {
    const { teams, userData, isUserLogged, isTeamSelectorOpen } = this.props;
    const userTeamId = userData.get('teamId');
    const userName = userData.get('name', '') || '';
    const firstName = userName.split(' ')[0];

    return (
      <Modal
        visible={isUserLogged && isTeamSelectorOpen}
        animationType={'fade'}
      >
        <View style={styles.inputGroup}>
          <View style={styles.inputLabel}>
            <AnimateMe animationType={'fade-from-bottom'} delay={500} duration={300}>
              <Text style={styles.inputLabelText}>Welcome {firstName}!</Text>
            </AnimateMe>
            <AnimateMe animationType={'fade-from-bottom'} delay={800} duration={300}>
              <Text style={styles.inputLabelSubtitle}>Choose your Tribe</Text>
            </AnimateMe>
          </View>

          <AnimateMe animationType={'fade-from-left'} delay={1000} duration={600} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.scrollView}>
              {teams.map((team, index) => <Team
                last={index + 1 === teams.size}
                key={team.get('id')}
                name={team.get('name')}
                teamid={team.get('id')}
                logo={team.get('imagePath')}
                selected={userTeamId}
                onPress={() => this.props.selectTeam(team.get('id'))}/>
              )}
            </ScrollView>
          </AnimateMe>

          {!isNil(userTeamId) &&
            <AnimateMe style={{ flex: 0 }} animationType={'fade-from-bottom'} duration={200}>
              <Fab
                onPress={this.props.saveInitialTeamSelection}
                styles={styles.button}
                underlayColor={theme.black}
              >
                <Text style={styles.buttonText}>
                  <Icon size={30} name="done" />
                </Text>
              </Fab>
            </AnimateMe>
          }
        </View>
      </Modal>
    )
  }
};

const styles = StyleSheet.create({
  inputGroup: {
    flex: 1,
    justifyContent: 'center',
    padding: 0,
    flexGrow: 1,
  },
  inputLabel: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: theme.white,
    elevation: 2,
    shadowColor: theme.secondaryDark,
    shadowOpacity: 0.07,
    shadowRadius: 10,
    shadowOffset: {
      height: 7,
      width: 0
    },
  },
  inputLabelText: typography.h1({ marginBottom: 0, color: theme.midgrey }),
  inputLabelSubtitle: typography.h1({ color: theme.primary, marginBottom: 0 }),
  scrollView: {
    padding: 20,
    paddingVertical: 15,
  },
  button: {
    backgroundColor: theme.primary,
    bottom: 30,
    zIndex: 10,
    elevation: 2,
    shadowColor: theme.black,
    shadowOpacity: 0.2,
    shadowRadius: 7,
    shadowOffset: {
      height: 5,
      width: 0
    },
  },
  buttonText: {
    color: theme.white,
    backgroundColor: 'transparent',
  }
});

const mapDispatchToProps = {
  selectTeam,
  saveInitialTeamSelection,
};

const select = createStructuredSelector({
  userData: getUser,
  teams: getTeams,
  isUserLogged: isUserLoggedIn,
  isTeamSelectorOpen: isLoginTeamSelectorOpen,
});

export default connect(select, mapDispatchToProps)(TeamSelector);
