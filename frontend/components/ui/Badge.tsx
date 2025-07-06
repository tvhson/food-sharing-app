import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Colors from '../../global/Color';
import {getFontFamily} from '../../utils/fonts';
import {scale, moderateScale} from '../../utils/scale';

export interface IBadge {
  title: string;
  type: 'assisted' | 'posts';
  count: number;
}

const Badge: React.FC<IBadge> = ({title, type, count}) => {
  const getBadgeStyle = () => {
    if (type === 'assisted') {
      if (count >= 100) return styles.badgeGold;
      if (count >= 50) return styles.badgeSilver;
      if (count >= 10) return styles.badgeBronze;
    } else {
      if (count >= 100) return styles.badgeGold;
      if (count >= 50) return styles.badgeSilver;
      if (count >= 10) return styles.badgeBronze;
    }
    return styles.badgeDefault;
  };

  const getBadgeTextStyle = () => {
    if (type === 'assisted') {
      if (count >= 100) return styles.textGold;
      if (count >= 50) return styles.textSilver;
      if (count >= 10) return styles.textBronze;
    } else {
      if (count >= 100) return styles.textGold;
      if (count >= 50) return styles.textSilver;
      if (count >= 10) return styles.textBronze;
    }
    return styles.textDefault;
  };

  return (
    <View style={[styles.badge, getBadgeStyle()]}>
      <Text style={[styles.badgeText, getBadgeTextStyle()]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(6),
    borderRadius: moderateScale(20),
    marginHorizontal: moderateScale(4),
    marginVertical: moderateScale(2),
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: moderateScale(80),
  },
  badgeDefault: {
    backgroundColor: Colors.gray200,
  },
  badgeBronze: {
    backgroundColor: '#CD7F32',
  },
  badgeSilver: {
    backgroundColor: '#C0C0C0',
  },
  badgeGold: {
    backgroundColor: '#FFD700',
  },
  badgeText: {
    fontSize: scale(12),
    fontFamily: getFontFamily('semibold'),
    textAlign: 'center',
  },
  textDefault: {
    color: Colors.gray600,
  },
  textBronze: {
    color: Colors.white,
  },
  textSilver: {
    color: Colors.white,
  },
  textGold: {
    color: Colors.black,
  },
});

export default Badge;
