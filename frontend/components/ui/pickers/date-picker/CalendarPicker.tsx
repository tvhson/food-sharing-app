import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';

import {DatePickerModal} from './DatePicker';
import {moderateScale} from '../../../../utils/scale';

interface CalendarPickerProps {
  onDateSelect?: (date: Date) => void;
  initialDate?: Date;
  iconStyle?: any;
  mode?: 'date' | 'time' | 'datetime';
  isDisabled?: boolean;
}

export interface CalendarPickerRef {
  open: () => void;
  close: () => void;
}

export const CalendarPicker = forwardRef<
  CalendarPickerRef,
  CalendarPickerProps
>(
  (
    {
      onDateSelect,
      initialDate = new Date(),
      iconStyle = {},
      mode = 'date',
      isDisabled = false,
      ...rest
    },
    ref,
  ) => {
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      open: () => setIsDatePickerVisible(true),
      close: () => setIsDatePickerVisible(false),
    }));

    return (
      <>
        <TouchableOpacity
          disabled={isDisabled}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          onPress={() => setIsDatePickerVisible(true)}>
          <Image
            source={require('../../../../assets/images/fi-rs-calendar.png')}
            style={[
              {
                tintColor: '#000',
                width: moderateScale(24),
                height: moderateScale(24),
              },
              iconStyle,
            ]}
          />
        </TouchableOpacity>

        <DatePickerModal
          mode={mode}
          isVisible={isDatePickerVisible}
          onClose={() => setIsDatePickerVisible(false)}
          onDateSelect={onDateSelect}
          initialDate={initialDate}
          {...rest}
        />
      </>
    );
  },
);
