import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Colors from '../../global/Color';
import {getFontFamily} from '../../utils/fonts';
import {scale, moderateScale} from '../../utils/scale';

interface StatisticCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
}

const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  icon,
  color,
}) => {
  return (
    <View style={[styles.card, {backgroundColor: color}]}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    marginHorizontal: moderateScale(4),
    minHeight: moderateScale(100),
    justifyContent: 'space-between',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    alignSelf: 'flex-end',
    marginBottom: moderateScale(8),
  },
  icon: {
    fontSize: scale(24),
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  value: {
    fontSize: scale(24),
    fontFamily: getFontFamily('bold'),
    color: Colors.white,
    marginBottom: moderateScale(4),
  },
  title: {
    fontSize: scale(12),
    fontFamily: getFontFamily('medium'),
    color: Colors.white,
    opacity: 0.9,
  },
});

export default StatisticCard;
