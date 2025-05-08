/* eslint-disable react-hooks/rules-of-hooks */
import {Checkbox, Icon, Menu} from 'react-native-paper';
import MapView, {LatLng, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useMemo, useRef, useState} from 'react';
/* eslint-disable react/self-closing-comp */
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {moderateScale, scale, verticalScale} from '../utils/scale';

import Colors from '../global/Color';
import {CustomMarker} from '../components/ui/CustomMarker';
import {RootState} from '../redux/Store';
import {calculateDistance} from '../utils/helper';
import {createNotifications} from 'react-native-notificated';
import {getFontFamily} from '../utils/fonts';
import {useSelector} from 'react-redux';

const dummyLocations = [
  {id: 1, title: 'Place A', latitude: 37.42199, longitude: -122.08},
  {id: 2, title: 'Place B', latitude: 34, longitude: -123},
  {id: 3, title: 'Place C', latitude: 35, longitude: -121},
];

const listFilter = [
  {id: 1, title: 'Khoảng cách < 2km', value: '<2'},
  {id: 2, title: 'Khoảng cách từ 2 đến 5km', value: '2-5'},
  {id: 3, title: 'Khoảng cách > 5km', value: '>5'},
  {id: 4, title: 'Tất cả', value: 'all'},
];
const {useNotifications} = createNotifications();

const MapScreen = ({navigation}: any) => {
  const location = useSelector((state: RootState) => state.location);
  const {notify} = useNotifications();
  const markerRef = useRef<any>(null);

  const [filter, setFilter] = useState<string>();
  const [visible, setVisible] = useState(false);

  const filteredMarkers = useMemo(() => {
    return dummyLocations.filter(place => {
      const distance = calculateDistance(place, location);
      if (filter === '<2') return distance < 2;
      if (filter === '2-5') return distance >= 2 && distance <= 5;
      if (filter === '>5') return distance > 5;
      return true;
    });
  }, [filter, location]);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (filteredMarkers.length === 0) {
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
        latitude: m.latitude,
        longitude: m.longitude,
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
    if (markerRef.current) {
      markerRef.current.showCallout();
    }
  }, [filter, mapRef]);

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
        <Text style={styles.title}>Tìm kiếm đồ ăn gần bạn</Text>
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
                setFilter(item.value);
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
          <CustomMarker key={marker.id} marker={marker} />
        ))}
      </MapView>
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  filterContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
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
  title: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: Colors.white,
    fontFamily: getFontFamily('bold'),
  },
  floatBtn: {
    position: 'absolute',
    left: 10,
    zIndex: 100,
  },
});
