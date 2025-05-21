/* eslint-disable react-hooks/rules-of-hooks */
import MapView, {LatLng, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {Checkbox, Icon, Menu} from 'react-native-paper';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {moderateScale, scale, verticalScale} from '../utils/scale';
import {createNotifications} from 'react-native-notificated';
import {useSelector} from 'react-redux';
import {CustomMarker} from '../components/ui/CustomMarker';
import Colors from '../global/Color';
import {RootState} from '../redux/Store';
import {getFontFamily} from '../utils/fonts';
import {calculateDistance} from '../utils/helper';
import {SharingPost} from '../redux/SharingPostReducer';
import {getPosts} from '../api/PostApi';

const listFilter = [
  {id: 1, title: 'Trong vòng 2km', value: 2},
  {id: 2, title: 'Trong vòng 5km', value: 5},
  {id: 3, title: 'Trong vòng 10km', value: 10},
  {id: 4, title: 'Tất cả', value: 'all'},
];
const {useNotifications} = createNotifications();

const MapScreen = ({navigation}: any) => {
  const location = useSelector((state: RootState) => state.location) || {
    latitude: useSelector((state: RootState) => state.userInfo.latitude),
    longitude: useSelector((state: RootState) => state.userInfo.longitude),
  };

  const accessToken = useSelector((state: RootState) => state.token.key);

  const {notify} = useNotifications();
  const markerRef = useRef<any>(null);

  const [filter, setFilter] = useState<number>();
  const [visible, setVisible] = useState(false);
  const [filteredMarkers, setFilteredMarkers] = useState<SharingPost[]>([]);

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
