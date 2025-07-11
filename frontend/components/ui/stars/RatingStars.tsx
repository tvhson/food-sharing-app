import {Icon} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import Animated, {FadeIn} from 'react-native-reanimated';
import Colors from '../../../global/Color';
import {scale} from '../../../utils/scale';

interface RatingStarsProps {
  maxStars?: number;
  size?: number;
  color?: string;
  initialRating?: number;
  onRatingChange: (rating: number) => void;
  disabled?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  maxStars = 5,
  size = 30,
  color,
  initialRating = 0,
  onRatingChange,
  disabled = false,
}) => {
  const starColor = color || Colors.yellow;
  const [rating, setRating] = useState(initialRating);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handlePress = (selectedRating: number) => {
    if (disabled) return;

    const newRating = selectedRating + 1;
    if (newRating === rating) return;
    setRating(newRating);
    onRatingChange(newRating);
  };

  const getStarType = (index: number) => {
    return index < rating ? 'star' : 'star-o';
  };

  return (
    <View style={{flexDirection: 'row', gap: scale(8)}}>
      {[...Array(maxStars)].map((_, index) => (
        <Animated.View key={index} entering={FadeIn.delay(index * 100)}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => handlePress(index)}
            disabled={disabled}>
            <Icon
              type="font-awesome"
              name={getStarType(index)}
              size={scale(size)}
              color={starColor}
            />
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
};
