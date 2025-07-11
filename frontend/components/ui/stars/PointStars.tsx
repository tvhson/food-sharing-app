import {Icon} from '@rneui/themed';
import React from 'react';
import {View} from 'react-native';
import Animated, {FadeIn} from 'react-native-reanimated';
import {scale} from '../../../utils/scale';
import Colors from '../../../global/Color';

interface PointStarsProps {
  numberOfStars: number;
  point: number;
  size?: number;
  color?: string;
}

export const PointStars: React.FC<PointStarsProps> = ({
  numberOfStars,
  point,
  size = 30,
  color,
}) => {
  const starColor = color || Colors.yellow;

  const getStarType = (index: number) => {
    const difference = point - index;
    if (difference >= 0.75) {
      return 'star';
    } else if (difference >= 0.25) {
      return 'star-half-full';
    }
    return 'star-o';
  };

  return (
    <View style={{flexDirection: 'row', gap: scale(8)}}>
      {[...Array(numberOfStars)].map((_, index) => (
        <Animated.View key={index} entering={FadeIn.delay(index * 100)}>
          <Icon
            type="font-awesome"
            name={getStarType(index)}
            size={scale(size)}
            color={starColor}
          />
        </Animated.View>
      ))}
    </View>
  );
};
