import React, {useMemo} from 'react';
import {Image} from 'react-native';
import {Marker} from 'react-native-maps';
import {SharingPost} from '../../redux/SharingPostReducer';

type CustomMarkerProps = {
  marker: SharingPost;
  onPress: () => void;
};

export const CustomMarker = React.memo(
  ({marker, onPress}: CustomMarkerProps) => {
    // Memoize coordinates to avoid object recreation on each render
    const coordinate = useMemo(
      () => ({
        latitude: Number(marker.latitude),
        longitude: Number(marker.longitude),
      }),
      [marker.latitude, marker.longitude],
    );

    return (
      <Marker
        coordinate={coordinate}
        title={marker.title}
        onPress={onPress}
        tracksViewChanges={false} // prevents flickering when using custom images
      >
        <Image
          source={require('../../assets/images/map-marker.png')}
          style={{width: 24, height: (24 * 74) / 55}}
        />
      </Marker>
    );
  },
);
