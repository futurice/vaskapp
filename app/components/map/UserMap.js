'use strict';

import React, { Component, PropTypes } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView from 'react-native-maps';
import { connect } from 'react-redux';
import autobind from 'autobind-decorator';
import { fromJS } from 'immutable';


import Text from '../common/MyText';
import { get, random, isEmpty } from 'lodash';
import Icon from 'react-native-vector-icons/Ionicons';
import MDIcon from 'react-native-vector-icons/MaterialIcons';
import analytics from '../../services/analytics';

import EventDetail from '../calendar/EventDetailView';
import Loader from '../common/Loader';
import Button from '../common/Button';
import CommentsView from '../comment/CommentsView';
import PlatformTouchable from '../common/PlatformTouchable';
import time from '../../utils/time';
import theme from '../../style/theme';
import MARKER_IMAGES, { ICONS } from '../../constants/MarkerImages';
// import MAP_STYLE from '../../constants/MapStyle';
import permissions from '../../services/android-permissions';
import location from '../../services/location';
import PostCallout from './Callout/Post';
import CityCallout from './Callout/City';
import MapTimeSelector from './MapTimeSelector';
import LocateButton from './LocateButton';

import { CITY_CATEGORIES, HELSINKI } from '../../constants/Cities';

import {
  mapViewData,
  selectMarker,
  selectCategory,
  toggleLocateMe,
  updateShowFilter,
  fetchPostsForCity,
} from '../../concepts/map';

import { openComments } from '../../concepts/comments';
import { openLightBox } from '../../concepts/lightbox';


const { width, height } = Dimensions.get('window');

// helsinki
const defaultStartLocation = CITY_CATEGORIES[HELSINKI];

const IOS = Platform.OS === 'ios';
const calloutHeight = IOS ? 140 : 140;
const VIEW_NAME = 'UserMap';

class UserMap extends Component {

  constructor(props) {
    super(props);

    this.state = { calloutAnimation: new Animated.Value(0) };
  }

  @autobind
  openPostComments(postId) {
    this.props.openComments(postId);
    this.props.navigator.push({ component: CommentsView, name: 'Comments', showName: true });
  }

  componentDidMount() {
    analytics.viewOpened(VIEW_NAME);

    // load for selected city and fit markers
    this.props.fetchPostsForCity()
      // Need to setTimeout for initial fitMarkerToMap for Android issue
      //
      // https://github.com/airbnb/react-native-maps/issues/1003
      .then(() => setTimeout(this.fitMarkersToMap, IOS ? 0 : 500));
  }

  componentWillReceiveProps(nextProps) {
    const { selectedMarker, selectedCategory } = this.props;

    // Animate map when city is changed
    if (selectedCategory && selectedCategory !== nextProps.selectedCategory) {
      const cityCoords = this.getCityCoords(nextProps.selectedCategory);
      if (cityCoords && !isEmpty(cityCoords)) {
        this.map.animateToCoordinate(cityCoords, 1);
      }
    }

    // Custom callout animation
    if (!selectedMarker && nextProps.selectedMarker) {
      this.animateCallout(true);
    } else if (selectedMarker && !nextProps.selectedMarker) {
      this.animateCallout(false);
    }
  }

  @autobind
  onEventMarkerPress(event) {
    this.props.navigator.push({
      component: EventDetail,
      name: event.name,
      model: event,
      disableTopPadding: true
    });
  }

  getCityRegion(city) {
    let cityCoords = this.getCityCoords(city);
    let zoomLevel = 0.025;

    if (!cityCoords || isEmpty(cityCoords)) {
      cityCoords = defaultStartLocation;
      zoomLevel = 3;
    }

    const deltaSettings = {
      latitudeDelta: zoomLevel,
      longitudeDelta: zoomLevel,
    };


    return Object.assign(deltaSettings, cityCoords);
  }

  @autobind
  getCityCoords(city) {
    const currentCityLocation = this.props.markerLocations.getIn([city, 'location']);
    return currentCityLocation ? currentCityLocation.toJS() : {};
  }

  @autobind
  onLocatePress() {
    if (IOS) {
      this.props.toggleLocateMe();
    } else {
      permissions.requestLocationPermission(this.props.toggleLocateMe);
    }
  }

  @autobind
  animateCallout(show) {
    Animated.timing(this.state.calloutAnimation, { toValue: show ? 1 : 0, duration: 300 }).start();
  }

  renderCloseLayer(location) {
    if (!location) {
      return null;
    }

    return (
      <View style={styles.customCalloutCloseLayer}>
        <TouchableWithoutFeedback delayPressIn={0} onPress={this.onClosemarker}>
          <View style={{flex: 1 }}/>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  @autobind
  renderCustomCallout(location) {
    let calloutProps = {};
    // if (location && location.get('url')) {
    //   calloutProps = {
    //     onPress: () => Linking.openURL(location.get('url'))
    //   }
    // }

    const calloutAnimationStyles = {
      opacity: this.state.calloutAnimation,
      top: this.state.calloutAnimation.interpolate({ inputRange: [0, 1], outputRange: [calloutHeight, 0] }),
      height: this.state.calloutAnimation.interpolate({ inputRange: [0, 1], outputRange: [0, calloutHeight] }),
    };

    return (
      <Animated.View style={[styles.customCallout, calloutAnimationStyles]}>
        {location && <TouchableHighlight
          underlayColor='transparent'
          style={styles.calloutTouchable}
          {...calloutProps}
        >
          <View style={styles.callout}>
            {
              location && this.props.categories.indexOf(location.get('type')) >= 0
                ? <CityCallout item={location} />
                : <PostCallout
                    onImagePress={this.props.openLightBox}
                    openComments={this.openPostComments}
                    item={location}
                  />
            }
          </View>
        </TouchableHighlight>
        }
      </Animated.View>
    );
  }

  @autobind
  renderCheckIn() {
    const isCheckInAvailable = false;
    return (
      <View style={styles.checkIn}>
        <TouchableOpacity
          onPress={this.onCheckInPress}
          style={styles.checkInButton}
        >
          <MDIcon
            name="add-location"
            style={styles.checkInButtonText}
          />
        </TouchableOpacity>
      </View>
      );
  }

  onCheckInPress() {
    location.getLocation((position) => {
      alert(`Latitude: ${position.coords.latitude} Longitude: ${position.coords.longitude}`)
    });
  }

  maybeRenderLoading() {
    if (this.props.loading) {
      return <View style={styles.loaderContainer}>
        <Loader color={theme.secondary} />
      </View>;
    }

    return false;
  }

  @autobind
  onSelectMarker(marker) {
    const { selectMarker } = this.props;

    selectMarker(marker.id, marker.type);
    this.map.animateToCoordinate(marker.location);
  }

  @autobind
  onClosemarker() {
    this.props.selectMarker(null);
  }

  @autobind
  onCategorySelect(category) {
    const { categories } = this.props;
    const index = categories.findIndex(c => c === category);

    const total = categories.size;

    // TODO Find correct scrollTo position
    //  If clicked item is not completely visible, scroll view to make it visible
    //  Last item gives an error regarding to getItemLayout,
    //  using scrollToEnd for last index works correctly
    if (total > index + 1) {
      this.categoryScroll.scrollToIndex({ viewPosition: 0.5, index });
    } else {
      this.categoryScroll.scrollToEnd();
    }

    // Action for category selec
    this.props.selectCategory(category)
    .then(this.fitMarkersToMap);
  }

  @autobind
  fitMarkersToMap() {
    const { visiblemarkerCoords } = this.props;

    if (this.map && visiblemarkerCoords && visiblemarkerCoords.length > 1) {
      const padding = visiblemarkerCoords.length <= 2 ? 100 : 80;
      const edgePadding = { top: padding, bottom: padding, left: padding, right: padding };
      this.map.fitToCoordinates(visiblemarkerCoords, { edgePadding }, false)
    }
  }

  @autobind
  renderMarkerFilterButton({ item }) {
    const { selectedCategory } = this.props;
    return (
      <PlatformTouchable
        key={item}
        onPress={() => this.onCategorySelect(item)}
      >
        <View style={[styles.markerFilterButton, item === selectedCategory ? styles.activeButton : {}]}>
          <Text style={[styles.markerFilterButtonText, item === selectedCategory ? styles.activeButtonText : {}]}>
            {item}
          </Text>
        </View>
      </PlatformTouchable>
    )
  }

  renderMarkerFilter() {
    const { categories } = this.props;
    const keyExtractor = (item, index) => item;
    return (
      <View style={styles.markerNavigation}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.markerNavigationScroll}
          ref={ref => this.categoryScroll = ref}
          renderItem={this.renderMarkerFilterButton}
          keyExtractor={keyExtractor}
          data={categories.toJS()}
        />
      </View>
    )
  }

  getMarker(marker, selectedMarker) {
    // if (marker && marker.type === 'HOTEL') {
    //   return MARKER_IMAGES['HOME']
    // }
    if (marker && this.props.categories.indexOf(marker.type) >=0) {
      return MARKER_IMAGES['FUTU']
    }

    return { uri: get(marker, ['author', 'profilePicture']) };
    // return MARKER_IMAGES[selectedMarker && marker.title === selectedMarker.get('title') ? 'SELECTED' : 'DEFAULT']
  }

  render() {
    const { mapMarkers, markerLocations, selectedMarker, selectedCategory } = this.props;
    const markersJS = mapMarkers.toJS();

    const markers = markersJS.map((location, index) => {
      const isSelectedMarker = selectedMarker && location.id === selectedMarker.get('id');
      return <MapView.Marker
        centerOffset={{ x: 0, y: 0 }}
        anchor={{ x: 0.5, y: 0.5 }}
        key={location.id}
        coordinate={location.location}
        onPress={() => this.onSelectMarker(location)}
        style={isSelectedMarker ? { zIndex: markersJS.length + 1, transform: [{ scale: 1.2 }] } : { zIndex: parseInt(location.id) }}
      >
        <View style={styles.avatarMarker}>
          <Image
            style={styles.avatarMarkerImage}
            source={this.getMarker(location, selectedMarker)}
          />
        </View>
      </MapView.Marker>;
    });

    const initialRegion = this.getCityRegion(selectedCategory);
    const areCategoriesReady = true;

    return (
      <View style={{ flex:1 }}>
        {this.renderMarkerFilter()}
        <View style={styles.mapWrap}>
          <View style={{ flex:1 }}>
            {areCategoriesReady &&
              <MapView
                style={styles.map}
                initialRegion={initialRegion}
                showsUserLocation={this.props.locateMe}
                showsPointsOfInterest={true}
                showsBuildings={true}
                showsIndoors={false}
                rotateEnabled={false}
                ref={(map) => { this.map = map; }}
                // customMapStyle={MAP_STYLE} // TODO IOS Support
                // https://github.com/airbnb/react-native-maps#customizing-the-map-style
                // provider={PROVIDER_GOOGLE}
              >
                {markers}
              </MapView>
            }
          </View>

          {this.maybeRenderLoading()}

          <LocateButton onPress={this.onLocatePress} isLocating={this.props.locateMe} />

          {this.renderCustomCallout(selectedMarker)}
          {/* !selectedMarker && <MapTimeSelector /> */}
          {/* this.renderCheckIn() */}
          {/*this.renderCloseLayer(selectedMarker)*/}
        </View>
      </View>
    );
  }


}

UserMap.propTypes = {
  navigator: PropTypes.object.isRequired,
  markers: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-start',
  },
  mapWrap: {
    flexGrow: 1,
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  avatarMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.white,


    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: {
      height: 1,
      width: 0
    },
  },
  avatarMarkerImage: {
    width: 26,
    height: 26,
    borderRadius: 13
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  customCalloutCloseLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  customCallout: {
    zIndex: 10,
    overflow: 'visible',
    width: width,
    position: 'relative',
    left: 0,
    bottom: 0,
    height: calloutHeight,
    backgroundColor: theme.transparent,
  },
  callout: {
    flexGrow: 1,
    flex: 1,
    flexDirection:'row',
  },
  calloutTouchable: {
    padding: 0,
    flexGrow: 1,
  },
  checkIn: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
    elevation: 2,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
    shadowRadius: 1,
    shadowOffset: {
      height: 1,
      width: 0
    },

    bottom: 26,
    left: (width / 2) - 28,
    borderRadius: 28,
    height: 56,
    width: 56
  },
  checkInButton: {
    padding: 0,
  },
  checkInButtonText: {
    fontSize: 24,
    textAlign: 'center',
    backgroundColor: theme.transparent,
    color: theme.secondary
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDD'
  },
  emptyIconWrap: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyIcon: {
    color: '#bbb',
    fontSize: 100
  },
  emptyContent: {
    paddingTop: 10,
    paddingBottom: 15,
    padding: 50,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 30,
    textAlign: 'center',
    color:'#666'
  },
  emptyText: {
    textAlign: 'center',
    color:'#999'
  },

  markerNavigation: {
    height: 52,
    zIndex: 10,
    justifyContent: 'flex-start',
    backgroundColor: theme.white,
    elevation: 2
  },
  markerNavigationScroll: {
    flex: 1
  },
  markerFilter: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignContent: 'stretch',
    height: 52,
  },
  markerFilterButton: {
    height: 52,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'stretch',
    paddingTop: 4,
    borderBottomWidth: 2,
    borderBottomColor: theme.white,
  },
  activeButton: {
    borderBottomWidth: 2,
    borderBottomColor: theme.blue2,
  },
  activeButtonText: {
    color: theme.blue2
  },
  markerFilterButtonText: {
    paddingTop: 2,
    fontSize: 13,
    fontWeight: IOS ? 'bold' : 'normal',
    fontFamily: IOS ? 'Futurice' : 'Futurice_bold',
    color: theme.midgrey,
  },
  markerFilterIcon: {
    color: theme.grey2,
    fontSize: 28,
  }
});

const mapDispatchToProps = {
  selectMarker,
  selectCategory,
  toggleLocateMe,
  updateShowFilter,
  openComments,
  openLightBox,
  fetchPostsForCity,
};

export default connect(mapViewData, mapDispatchToProps)(UserMap);
