import {ReactNode} from 'react';
import {Control, FieldValues, Path} from 'react-hook-form';
import {StyleProp, TextInputProps, TextStyle, ViewStyle} from 'react-native';
import {DatePickerProps} from 'react-native-date-picker';
import {z} from 'zod';

export interface InputProps<T extends FieldValues> extends TextInputProps {
  controller: {
    control: Control<T>;
    name: Path<T>;
  };
  label?: string;
  required?: boolean;
  helperText?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  rightIconComponent?: React.ReactNode;
  leftIconComponent?: React.ReactNode;
  errorText?: string;
  isDatePicker?: boolean;
  dateFormat?: string;
  schema?: {
    [key: string]: z.ZodType;
  };
  isNumberInput?: boolean;
  rightComponent?: ReactNode;
  isValid?: boolean;
  inputContainerStyle?: StyleProp<ViewStyle>;
  isTextArea?: boolean;
  isShowValidIcon?: boolean;
  multiline?: boolean;
  labelColor?: string;
  isVerification?: boolean;
  onOpenOtpBs?: () => void;
  isDisabled?: boolean;
  onInputFocus?: () => void;
  calendarPickerProps?: DatePickerProps;
  helperTextStyle?: StyleProp<TextStyle>;
  errorTextStyle?: StyleProp<TextStyle>;
}
