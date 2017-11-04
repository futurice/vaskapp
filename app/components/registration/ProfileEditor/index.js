'use strict';

import React, { Component, PropTypes } from 'react';
import {
  View,
  Image,
  TextInput,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import { cloneDeep } from 'lodash';

import permissions from '../../../services/android-permissions';
import ImageCaptureOptions from '../../../constants/ImageCaptureOptions';
import ImagePickerManager from 'react-native-image-picker';

import Text from '../../common/MyText';
import Button from '../../common/Button';
import ScrollHeader from '../../common/ScrollHeader';
import theme from '../../../style/theme';
import typography from '../../../style/typography';
import { getNameInitials } from '../../../utils/name-format';

import Toolbar from '../RegistrationToolbar';
import Team from '../Team';
import {
  putUser,
  updateName,
  updateUserInfo,
  selectTeam,
  reset,
  closeRegistrationView,
  isUserLoggedIn,
  isLoadingProfilePicture,
  getUser,
  getUserName,
  postProfilePicture,
} from '../../../concepts/registration';
import { setCity, getCityIdByTeam, getCityId } from '../../../concepts/city';
import { getTeams } from '../../../reducers/team';

import * as keyboard from '../../../utils/keyboard';
import Icon from 'react-native-vector-icons/MaterialIcons';

const IOS = Platform.OS === 'ios';
const { width, height } = Dimensions.get('window');

class ProfileEditorView extends Component {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => {
      if (this.props.isRegistrationViewOpen && this.props.isRegistrationInfoValid) {
        this.onCloseProfileEditor()
        return true;
      }
      return false;
    })
  }


  constructor(props) {
    super(props);
    this.state = { selectedCity: props.selectedCityId || 2 };
  }

  @autobind
  chooseImage() {
    // cancel action if already loading image
    if (this.props.isLoadingPicture) {
      return;
    }

    if (IOS) {
      this.openImagePicker();
    } else {
      permissions.requestCameraPermission(() => {
        setTimeout(() => {
          this.openImagePicker();
        });
      });
    }
  }

  @autobind
  openImagePicker() {
    // Create selfie image capture options
    const selfieCaptureOptions = Object.assign(
      cloneDeep(ImageCaptureOptions),
      {
        title: 'Change Avatar',
        cameraType: 'front',
        takePhotoButtonTitle: 'Take a selfie',
      },
    );

    ImagePickerManager.showImagePicker(selfieCaptureOptions, (response) => {
      if (!response.didCancel && !response.error) {
        const image = 'data:image/jpeg;base64,' + response.data;
        this.props.postProfilePicture(image);
      }
    });
  }


  @autobind
  onSelectTeam(id) {
    this.props.selectTeam(id);
    this.scrollToNameSelection();
  }

  @autobind
  onSelectCity(id) {
    this.setState({ selectedCity: id });
  }

  @autobind
  onRegister() {
    this.props.putUser();
  }

  @autobind
  onCloseProfileEditor() {
    if (this.props.isRegistrationInfoValid) {
      this.onRegister();
    }
    this.props.closeRegistrationView();
  }

  @autobind
  scrollToNameSelection() {
    const regScroll = this.containerScrollViewRef;
    if (regScroll) {
      regScroll.scrollToEnd({ animated: true });
    }
  }


  teamIsValid() {
    const { userData, teams } = this.props
    const { selectedCity } = this.state;
    const team = teams.find(t => t.get('id') === userData.get('teamId'));

    if (team) {
      return team.get('city') === selectedCity;
    }
    return false;
  }

  renderAvatar() {
    const { userData, isLoadingPicture } = this.props;
    const avatar = userData.get('image');
    const name = userData.get('name');

    return (
      <View style={styles.avatarInput}>
        <View style={styles.profilePicWrap}>
          <TouchableOpacity onPress={this.chooseImage} activeOpacity={isLoadingPicture ? 1 : 0.6}>
            {avatar
              ? <Image style={styles.profilePic} source={{ uri: avatar }} />
              : <Text style={styles.profileInitials}>{getNameInitials(name)}</Text>
            }
            <View style={styles.avatarChangeLayer}>
              {isLoadingPicture
                ? <ActivityIndicator size="small" color={theme.white} />
                : <Icon style={styles.avatarChangeIcon} name="camera-alt" />
              }
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderProfileEditor() {
    return (
      <View style={styles.container}>

        { IOS
          ? <Toolbar icon={'done'}
          iconClick={this.onCloseProfileEditor}
          title='Your Profile' />
          :  <ScrollHeader
          icon="done"
          elevation={0}
          onIconClick={this.onCloseProfileEditor}
          title={'Your Profile'} />
        }

        <ScrollView
          ref={view => this.containerScrollViewRef = view}
          showsVerticalScrollIndicator={true}
          style={{ flex:1 }}
        >
          <View style={[styles.innerContainer]}>

            <View style={styles.inputGroup}>
              {this.renderAvatar()}
              {this.renderNameSelect()}
            </View>

            {this.renderTeamSelect()}
          </View>
        </ScrollView>

        <View style={styles.bottomButtons}>
          <Button
            onPress={this.onRegister}
            style={styles.modalButton}
            isDisabled={!this.props.isRegistrationInfoValid}>
            SAVE
          </Button>
        </View>
      </View>
    );
  }

  renderTeamSelect() {
    const { teams, userData } = this.props;
    return (
      <View style={styles.inputGroup}>
        <View style={styles.inputLabel}>
          <Text style={styles.inputLabelText}>Tribe</Text>
        </View>
        <View>

          <ScrollView style={{ flex:1 }}>
            {teams.map((team, index) => <Team
              last={index + 1 === teams.size}
              key={team.get('id')}
              name={team.get('name')}
              teamid={team.get('id')}
              logo={team.get('imagePath')}
              selected={userData.get('teamId')}
              onPress={this.onSelectTeam.bind(this, team.get('id'))}/>
            )}
          </ScrollView>
        </View>
      </View>
    )
  }

  renderNameSelect() {
    const { userData } = this.props;
    return (
      <View style={styles.inputGroupx}>
        <View style={styles.inputLabel}>
          <Text style={styles.inputLabelText}>Name</Text>
        </View>
        <View style={styles.inputFieldWrap}>
          <Text style={styles.staticText}>{userData.get('name')}</Text>
          {/*<TextInput
            ref={view => this.nameTextInputRef = view}
            autoCorrect={false}
            autoCapitalize={'words'}
            clearButtonMode={'while-editing'}
            returnKeyType={'done'}
            style={[styles.inputField, styles['inputField_' + Platform.OS]]}
            onFocus={() => {
              keyboard.onInputFocus(this.containerScrollViewRef, this.nameTextInputRef,300);
            }}
            onBlur={() => {
              keyboard.onInputBlur(this.containerScrollViewRef)
            }}
            onChangeText={this.props.updateName}
            value={userData.get('name')}
          />*/}
        </View>

        <View style={styles.inputLabel}>
          <Text style={styles.inputLabelText}>Introduction</Text>
        </View>
        <View style={styles.inputFieldWrap}>
          <TextInput
            multiline={true}
            autoCorrect={false}
            autoCapitalize={'sentences'}
            clearButtonMode={'while-editing'}
            returnKeyType={'done'}
            style={[styles.inputField, styles.textarea, styles['inputField_' + Platform.OS]]}
            onChangeText={this.props.updateUserInfo}
            value={userData.get('info')}
          />
        </View>
      </View>
    );
  }

  render() {
    const { isUserLogged, isRegistrationViewOpen } = this.props;
    return (
      <Modal
        visible={isUserLogged && isRegistrationViewOpen}
        animationType={IOS ? 'fade' : 'slide'}
        onRequestClose={this.onCloseProfileEditor}
      >
        {this.renderProfileEditor()}
      </Modal>
    );
  }
}

// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 50,
    backgroundColor: theme.stable,
  },
  innerContainer: {
    flex:1,
    paddingTop: 0,
    paddingBottom: 50,
    margin: 0,
    borderRadius: 5
  },
  bottomButtons:{
    flex:1,
    flexDirection:'row',
    margin:0,
    marginBottom:0,
    marginLeft:0,
    marginRight:0,
    height:50,
    alignItems:'stretch',
    position:'absolute',
    bottom:0,
    left:0,
    right:0,
  },
  modalButton: {
    borderRadius:0,
    flex:1,
    marginLeft:0,
    backgroundColor: theme.black,
  },
  inputGroup:{
    padding: 20,
    backgroundColor: theme.white,
    marginBottom: 15,
    elevation: 2,
    flex:1,
    borderRadius: 0,
    overflow:'hidden'
  },
  item: {
    flex: 1
  },
  button: {
    height: 35,
    borderRadius: 2,
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center'
  },

  inputLabel:{
    paddingBottom: IOS ? 0 : 5,
  },
  inputLabelText: typography.h2({ marginBottom: 0 }),
  inputFieldWrap:{
    paddingTop: 4,
    marginBottom: 25,
  },
  staticText: {
    fontSize: 16,
    color: theme.primary,
  },
  inputField: {
    height: 40,
    fontSize:16,
  },
  inputField_android: {
    fontFamily: 'Futurice_regular',
  },
  inputField_ios: {
    fontFamily: 'Futurice',
    padding: 5,
    backgroundColor: 'rgba(20,20,20,0.04)',
  },
  textarea: {
    height: 100,
  },
  text: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },

  avatarInput: {
    backgroundColor: theme.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    paddingTop: 20,
    paddingBottom: 50,
  },
  profilePicWrap:{
    backgroundColor: theme.stable,
    borderRadius: 50,
    top: 0,
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    marginTop: 0,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileInitials: {
    fontSize: 34,
    top: IOS ? 7 : 0,
    color: theme.dark,
  },
  avatarChangeLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: theme.secondaryLayer,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8,
  },
  avatarChangeIcon: {
    color: theme.white,
    fontSize: 30,
    opacity: 1,
  }
});


const mapDispatchToProps = {
  putUser,
  updateName,
  updateUserInfo,
  reset,
  setCity,
  selectTeam,
  closeRegistrationView,
  postProfilePicture,
};

const select = store => ({
  isRegistrationViewOpen: store.registration.get('isRegistrationViewOpen'),
  userData: getUser(store),

  selectedCityId: getCityIdByTeam(store),
  viewCityId: getCityId(store),
  teams: getTeams(store),
  cities: store.city.get('list'),
  isRegistrationInfoValid: !!getUserName(store),
  isUserLogged: isUserLoggedIn(store),
  isLoadingPicture: isLoadingProfilePicture(store)
})

export default connect(select, mapDispatchToProps)(ProfileEditorView);