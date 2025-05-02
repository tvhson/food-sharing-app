import React, {useEffect, useRef} from 'react';

import {Marker} from 'react-native-maps';

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
      pinColor="#001e34"
      title={marker.title}
    />
  );
};
