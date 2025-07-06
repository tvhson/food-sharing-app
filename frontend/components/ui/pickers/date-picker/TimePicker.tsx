import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import {DatePickerModal} from './DatePicker';
import {moderateScale, scale} from '../../../../utils/scale';
import Colors from '../../../../global/Color';
import {getFontFamily} from '../../../../utils/fonts';

interface TimePickerProps {
  onTimeSelect?: (time: string) => void;
  initialTime?: string;
  iconStyle?: any;
  isDisabled?: boolean;
  placeholder?: string;
}

export interface TimePickerRef {
  open: () => void;
  close: () => void;
}

export const TimePicker = forwardRef<TimePickerRef, TimePickerProps>(
  (
    {
      onTimeSelect,
      initialTime = '',
      iconStyle = {},
      isDisabled = false,
      placeholder = 'HH:mm',
      ...rest
    },
    ref,
  ) => {
    const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => setIsTimePickerVisible(true),
      close: () => setIsTimePickerVisible(false),
    }));

    const getInitialDate = () => {
      if (!initialTime) return new Date();

      const [hours, minutes] = initialTime.split(':').map(Number);
      const date = new Date();
      date.setHours(hours || 0, minutes || 0, 0, 0);
      return date;
    };

    const handleTimeSelect = (date: Date) => {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const timeString = `${hours}:${minutes}`;
      onTimeSelect?.(timeString);
    };

    return (
      <>
        <TouchableOpacity
          disabled={isDisabled}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          onPress={() => setIsTimePickerVisible(true)}
          style={styles.container}>
          <Image
            source={require('../../../../assets/images/clock.png')}
            style={[
              {
                tintColor: Colors.gray600,
                width: moderateScale(24),
                height: moderateScale(24),
              },
              iconStyle,
            ]}
          />
        </TouchableOpacity>

        <DatePickerModal
          mode="time"
          isVisible={isTimePickerVisible}
          onClose={() => setIsTimePickerVisible(false)}
          onDateSelect={handleTimeSelect}
          initialDate={getInitialDate()}
          title="Chọn thời gian"
          {...rest}
        />
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
