import {Image} from 'react-native';
import {Marker} from 'react-native-maps';
import React from 'react';
import {SharingPost} from '../../redux/SharingPostReducer';

export const CustomMarker = ({
  marker,
  onPress,
}: {
  marker: SharingPost;
  onPress: () => void;
}) => {
  return (
    <Marker
      coordinate={{
        latitude: Number(marker.latitude),
        longitude: Number(marker.longitude),
      }}
      pinColor="navy"
      title={marker.title}
      onPress={onPress}>
      <Image
        source={require('../../assets/images/map-marker.png')}
        style={{width: 24, height: (24 * 74) / 55}}
      />
    </Marker>
  );
};
