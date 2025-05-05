/* eslint-disable react-native/no-inline-styles */
import {Image} from 'react-native';
import {Marker} from 'react-native-maps';
import React from 'react';

export const CustomMarker = ({
  marker,
}: {
  marker: {
    id: string | number;
    latitude: number;
    longitude: number;
    title: string;
    description?: string;
  };
}) => {
  return (
    <Marker
      coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
      pinColor="navy"
      title={marker.title}>
      <Image
        source={require('../../assets/images/map-marker.png')}
        style={{width: 24, height: (24 * 74) / 55}}
      />
    </Marker>
  );
};
