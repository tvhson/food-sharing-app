import React from 'react';
import DatePicker, {DatePickerProps} from 'react-native-date-picker';

/**
 * Props for the DatePickerModal component
 */
interface DatePickerModalProps
  extends Omit<
    DatePickerProps,
    'modal' | 'open' | 'date' | 'onConfirm' | 'onCancel'
  > {
  /**
   * The mode of the date picker
   * @default 'date'
   */
  mode: 'date' | 'time' | 'datetime';

  /**
   * Controls the visibility of the date picker modal
   * @required
   */
  isVisible: boolean;

  /**
   * Callback function when the modal is closed
   * @required
   */
  onClose: () => void;

  /**
   * Callback function when a date is selected
   * @param date The selected Date object
   */
  onDateSelect?: (date: Date) => void;

  /**
   * Initial date to display in the picker
   * @default new Date()
   */
  initialDate?: Date;
}

/**
 * A modal component that displays a date/time picker
 * @param {Object} props - The component props
 * @param {'date' | 'time' | 'datetime'} props.mode - The mode of the date picker
 * @param {boolean} props.isVisible - Controls the visibility of the date picker modal
 * @param {() => void} props.onClose - Callback function when the modal is closed
 * @param {(date: Date) => void} [props.onDateSelect] - Optional callback function when a date is selected
 * @param {Date} [props.initialDate=new Date()] - Initial date to display in the picker
 */
export const DatePickerModal = ({
  mode,
  isVisible,
  onClose,
  onDateSelect,
  initialDate = new Date(),
  ...rest
}: DatePickerModalProps) => {
  return (
    <DatePicker
      modal
      mode={mode}
      open={isVisible}
      date={initialDate}
      onConfirm={date => {
        onClose();
        onDateSelect?.(date);
      }}
      onCancel={onClose}
      locale={'vi'}
      confirmText={'Xác nhận'}
      cancelText={'Hủy'}
      title={'Chọn ngày'}
      {...rest}
    />
  );
};
