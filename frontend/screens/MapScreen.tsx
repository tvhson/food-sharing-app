import {Checkbox, Icon, Menu} from 'react-native-paper';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
/* eslint-disable react-hooks/rules-of-hooks */
import MapView, {LatLng, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {moderateScale, scale, verticalScale} from '../utils/scale';

import {Animated} from 'react-native';
import Colors from '../global/Color';
import {CustomMarker} from '../components/ui/CustomMarker';
import {RootState} from '../redux/Store';
import {Route} from '../constants/route';
import {SharingPost} from '../redux/SharingPostReducer';
import {createNotifications} from 'react-native-notificated';
import {getFontFamily} from '../utils/fonts';
import {getPosts} from '../api/PostApi';
import {useSelector} from 'react-redux';

const listFilter = [
  {id: 1, title: 'Trong vòng 2km', value: 2},
  {id: 2, title: 'Trong vòng 5km', value: 5},
  {id: 3, title: 'Trong vòng 10km', value: 10},
  {id: 4, title: 'Trong vòng 20km', value: 20},
  {id: 4, title: 'Tất cả', value: 100000},
];
const {useNotifications} = createNotifications();

const MapScreen = ({navigation}: any) => {
  const location = useSelector((state: RootState) => state.location) || {
    latitude: useSelector((state: RootState) => state.userInfo.latitude),
    longitude: useSelector((state: RootState) => state.userInfo.longitude),
  };
  const sharingPosts = useSelector(
    (state: RootState) => state.sharingPost.HomePage,
  );

  const accessToken = useSelector((state: RootState) => state.token.key);

  const {notify} = useNotifications();
  const markerRef = useRef<any>(null);

  const [filter, setFilter] = useState<number>(100000);
  const [visible, setVisible] = useState(false);
  const [filteredMarkers, setFilteredMarkers] =
    useState<SharingPost[]>(sharingPosts);
  const [selectedMarker, setSelectedMarker] = useState<SharingPost | null>(
    null,
  );

  const mapRef = useRef<MapView>(null);

  const getData = async () => {
    const response: any = await getPosts(accessToken.toString(), {
      type: 'ALL',
      latitude: location.latitude,
      longitude: location.longitude,
      distance: filter,
    });
    if (response.status === 200) {
      setFilteredMarkers(response.data);
    }
  };

  const slideAnim = useRef(new Animated.Value(200)).current; // Start below the screen

  const hideInfoPanel = () => {
    Animated.timing(slideAnim, {
      toValue: 200,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedMarker(null); // clear after animation completes
    });
  };

  useEffect(() => {
    if (selectedMarker) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedMarker]);

  useEffect(() => {
    getData();
  }, [filter]);

  useEffect(() => {
    if (!mapRef.current) return;
    console.log('Im here filteredMarkers', filteredMarkers.length);

    if (filteredMarkers.length === 0) {
      console.log('Im here notify');
      notify('error', {
        params: {
          description: 'Không tìm thấy địa điểm nào trong khu vực này',
          title: 'Thông báo',
          style: {
            multiline: 100,
          },
        },
      });
      return;
    }

    const coordinates: LatLng[] = [
      {latitude: location.latitude, longitude: location.longitude},
      ...filteredMarkers.map(m => ({
        latitude: Number(m.latitude),
        longitude: Number(m.longitude),
      })),
    ];

    if (coordinates.length > 1) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: {top: 80, right: 80, bottom: 80, left: 80},
        animated: true,
      });
    } else {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        },
        1000,
      );
    }
  }, [filteredMarkers, mapRef]);

  const handleBack = () => {
    navigation.goBack();
  };
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleBack}>
          <Icon source={'arrow-left'} size={25} color={Colors.white} />
        </TouchableOpacity>
        <Text
          style={[
            styles.title,
            {
              fontSize: moderateScale(20),
              fontWeight: 'bold',
              color: Colors.white,
            },
          ]}>
          Tìm kiếm đồ ăn gần bạn
        </Text>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          contentStyle={{backgroundColor: 'white'}}
          anchor={
            <TouchableOpacity onPress={openMenu}>
              <Icon source={'filter-variant'} size={24} color={'white'} />
            </TouchableOpacity>
          }>
          {listFilter.map(item => (
            <Menu.Item
              key={item.id}
              onPress={() => {
                if (typeof item.value === 'number') {
                  setFilter(item.value);
                } else {
                  setFilter(100000);
                }
                setVisible(false);
              }}
              title={
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Checkbox
                    color={Colors.greenText}
                    status={filter === item.value ? 'checked' : 'unchecked'}
                  />
                  <Text
                    style={{
                      color: Colors.black,
                      marginLeft: scale(8),
                      fontFamily: getFontFamily('regular'),
                    }}>
                    {item.title}
                  </Text>
                </View>
              }
            />
          ))}
        </Menu>
      </View>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        onPress={() => {
          if (selectedMarker) {
            hideInfoPanel();
          }
        }}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        <Marker
          ref={markerRef}
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Vị trí của bạn"
        />
        {filteredMarkers.map(marker => (
          <CustomMarker
            key={marker.id}
            marker={marker}
            onPress={() => setSelectedMarker(marker)}
          />
        ))}
      </MapView>
      {selectedMarker && (
        <Animated.View
          style={[
            styles.filterContainer,
            {transform: [{translateY: slideAnim}]},
          ]}>
          <Image
            source={{uri: selectedMarker.images[0]}}
            style={styles.image}
          />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{selectedMarker.title}</Text>
            <Text style={styles.description}>{selectedMarker.description}</Text>
            <View style={styles.distanceContainer}>
              <Icon source={'map-marker'} size={24} color={Colors.greenText} />
              <Text style={styles.distance}>
                {selectedMarker.distance.toFixed(2)} km
              </Text>
            </View>
            <TouchableOpacity
              style={styles.btn}
              onPress={() => {
                navigation.navigate(Route.PostDetail2, {
                  item: selectedMarker,
                  location: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                  },
                });
              }}>
              <Text style={styles.btnText}>Xem chi tiết</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: scale(10),
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(4),
  },
  infoContainer: {
    flex: 1,
    padding: scale(10),
    gap: scale(10),
  },
  title: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: Colors.black,
    fontFamily: getFontFamily('bold'),
  },
  distance: {
    fontSize: moderateScale(16),
    color: Colors.greenText,
    fontFamily: getFontFamily('regular'),
  },
  filterContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: scale(10),
    paddingHorizontal: scale(20),
    gap: scale(20),
    borderTopRightRadius: scale(10),
    borderTopLeftRadius: scale(10),
    backgroundColor: Colors.white,
    zIndex: 100,
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: Colors.greenText,
    padding: scale(10),
    height: verticalScale(50),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  description: {
    fontSize: moderateScale(16),
    color: Colors.black,
    fontFamily: getFontFamily('regular'),
  },
  floatBtn: {
    position: 'absolute',
    left: 10,
    zIndex: 100,
  },
  btn: {
    borderRadius: scale(10),
  },
  btnText: {
    fontSize: moderateScale(16),
    color: '#F05C00',
    fontFamily: getFontFamily('regular'),
  },
});
