/* eslint-disable react-hooks/rules-of-hooks */
import {Button, Icon} from 'react-native-paper';
/* eslint-disable react/self-closing-comp */
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import MapView, {LatLng, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import React, {useEffect, useRef, useState} from 'react';
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
const {useNotifications} = createNotifications();

const MapScreen = () => {
  const location = useSelector((state: RootState) => state.location);
  const {notify} = useNotifications();

  const [filter, setFilter] = useState<'<2' | '2-5' | '>5' | null>(null);

  const filteredMarkers = dummyLocations.filter(place => {
    const distance = calculateDistance(place, location);

    if (filter === '<2') return distance < 2;
    if (filter === '2-5') return distance >= 2 && distance <= 5;
    if (filter === '>5') return distance > 5;
    return true;
  });
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (filteredMarkers.length === 0) {
      notify('error', {
        params: {
          description: 'No markers found in the selected range',
          title: 'Error',
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
  }, [filter]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Happy Food</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              width: scale(24),
              height: verticalScale(24),
              marginRight: scale(20),
            }}></TouchableOpacity>
        </View>
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
      <View style={styles.filterContainer}>
        <Button
          mode="contained"
          onPress={() => setFilter('<2')}
          style={{margin: 5}}>
          <Text>{'Distance < 2km'}</Text>
        </Button>
        <Button
          mode="contained"
          onPress={() => setFilter('2-5')}
          style={{margin: 5}}>
          <Text>{'Distance 2-5km'}</Text>
        </Button>
        <Button
          mode="contained"
          onPress={() => setFilter('>5')}
          style={{margin: 5}}>
          <Text>{'Distance > 5km'}</Text>
        </Button>
        <Button
          mode="contained"
          onPress={() => setFilter(null)}
          style={{margin: 5}}>
          <Text>Reset</Text>
        </Button>
      </View>
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
    backgroundColor: 'white',
    padding: scale(10),
    height: verticalScale(50),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: Colors.greenText,
    fontFamily: getFontFamily('bold'),
  },
});
