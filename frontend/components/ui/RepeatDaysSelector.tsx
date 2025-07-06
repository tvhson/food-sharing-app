import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {Checkbox} from 'react-native-paper';
import Colors from '../../global/Color';
import {getFontFamily} from '../../utils/fonts';
import {scale} from '../../utils/scale';
import {CustomText} from './CustomText';

interface RepeatDaysSelectorProps {
  selectedDays: number[];
  onDaysChange: (days: number[]) => void;
  error?: string;
}

const DAYS_OF_WEEK = [
  {value: 2, label: 'T2'},
  {value: 3, label: 'T3'},
  {value: 4, label: 'T4'},
  {value: 5, label: 'T5'},
  {value: 6, label: 'T6'},
  {value: 7, label: 'T7'},
  {value: 8, label: 'CN'},
];

const RepeatDaysSelector: React.FC<RepeatDaysSelectorProps> = ({
  selectedDays,
  onDaysChange,
  error,
}) => {
  const toggleDay = (dayValue: number) => {
    const newSelectedDays = selectedDays.includes(dayValue)
      ? selectedDays.filter(day => day !== dayValue)
      : [...selectedDays, dayValue];
    onDaysChange(newSelectedDays);
  };

  return (
    <View style={styles.container}>
      <CustomText style={styles.label}>
        Ngày lặp lại{' '}
        <CustomText fontType="medium" size={14} textColor={Colors.red}>
          *
        </CustomText>
      </CustomText>
      <View style={styles.daysContainer}>
        {DAYS_OF_WEEK.map(day => (
          <TouchableOpacity
            key={day.value}
            style={[
              styles.dayButton,
              selectedDays.includes(day.value) && styles.selectedDayButton,
              error ? styles.errorBorder : {},
            ]}
            onPress={() => toggleDay(day.value)}>
            <Text
              style={[
                styles.dayText,
                selectedDays.includes(day.value) && styles.selectedDayText,
              ]}>
              {day.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: scale(16),
  },
  label: {
    fontSize: scale(16),
    fontFamily: getFontFamily('medium'),
    color: Colors.gray600,
    marginBottom: scale(8),
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: Colors.gray300,
    padding: scale(8),
  },
  dayButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
  },
  selectedDayButton: {
    backgroundColor: Colors.greenPrimary,
  },
  dayText: {
    fontSize: scale(14),
    fontFamily: getFontFamily('medium'),
    color: Colors.gray700,
  },
  selectedDayText: {
    color: Colors.white,
  },
  errorBorder: {
    borderColor: Colors.red,
  },
  errorText: {
    fontSize: scale(14),
    fontFamily: getFontFamily('medium'),
    color: Colors.red,
    marginTop: scale(4),
    paddingHorizontal: scale(10),
  },
});

export default RepeatDaysSelector;
