import dayjs from 'dayjs';
import React, {useEffect, useMemo, useRef} from 'react';
import {FieldValues, Path, PathValue, useController} from 'react-hook-form';
import {
  Image,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {moderateScale, scale} from '../../../utils/scale';

import {formatDate} from '../../../utils/LoadingContext';
import Colors from '../../../global/Color';

import {CalendarPicker, CalendarPickerRef} from '../pickers';

import {InputProps} from './types';
import {getFontFamily} from '../../../utils/fonts';
import {CustomText} from '../CustomText';
import {Icon} from '@rneui/themed';

export const CustomInput = <T extends FieldValues>(props: InputProps<T>) => {
  const ref = useRef<TextInput>(null);

  // Input height 56/2 minus label size 15
  const INITIAL_POSITION = moderateScale(7);
  const FINAL_POSITION = moderateScale(-10);
  const CHECKED_ICON_SIZE = scale(16);
  const LABEL_FONT_SIZE_MEDIUM = moderateScale(16);
  const LABEL_FONT_SIZE_SMALL = moderateScale(14);

  const {
    controller,
    label,
    required,
    placeholder,
    containerStyle,
    inputStyle,
    errorText,
    rightIconComponent,
    leftIconComponent,
    helperText,
    isDatePicker,
    isNumberInput,
    dateFormat = 'dd/MM/yyyy',
    inputContainerStyle,
    secureTextEntry,
    isTextArea,
    isShowValidIcon,
    labelColor,
    isVerification,
    onOpenOtpBs,
    onInputFocus,
    isDisabled,
    calendarPickerProps = {},
    onBlur,
    onChangeText,
    helperTextStyle,
    errorTextStyle,
    ...restProps
  } = props;

  const calendarPickerRef = useRef<CalendarPickerRef>(null);

  const {field, formState} = useController({
    control: controller.control,
    name: controller.name,
    defaultValue: '' as PathValue<T, Path<T>>,
  });

  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const isValid = useMemo(() => {
    // Check if the field has a value
    const hasValue = (() => {
      const value = field.value;

      // Handle null or undefined
      if (value === null || value === undefined) {
        return false;
      }

      // Handle string values (check for non-empty after trimming)
      if (typeof value === 'string') {
        return value.trim().length > 0;
      }

      // Handle number values (all numbers are valid except NaN)
      if (typeof value === 'number') {
        return !isNaN(value);
      }

      // Handle other types (objects, arrays, etc.)
      return Boolean(value);
    })();

    // If no value, field is not valid
    if (!hasValue) {
      return false;
    }

    // Get the field name as a key
    const fieldName = controller.name as keyof typeof formState.touchedFields;

    // Check if the field has been touched by the user
    const isTouched = Boolean(formState.touchedFields[fieldName]);

    // If not touched, field is not considered valid yet
    if (!isTouched) {
      return false;
    }

    // Check if the field has any validation errors
    const hasErrors = Boolean(formState.errors[controller.name]);

    // Field is valid if it has a value, has been touched, and has no errors
    return !hasErrors;
  }, [
    field.value,
    controller.name,
    formState.errors[controller.name],
    formState.touchedFields[
      controller.name as keyof typeof formState.touchedFields
    ],
  ]);

  const handleDateSelect = React.useCallback(
    (date: Date) => {
      try {
        if (!date) {
          return;
        }
        field.onChange(formatDate(date));
      } catch (error) {}
    },
    [field, dateFormat],
  );

  const getInitialDate = () => {
    if (!field.value) return new Date();

    try {
      const parsedDate = dayjs(field.value).toDate();
      return dayjs(parsedDate).isValid() ? parsedDate : new Date();
    } catch {
      return new Date();
    }
  };

  const labelAnimation = useSharedValue(
    label && !placeholder && field.value ? 1 : 0,
  );

  useEffect(() => {
    const hasValue = !!field.value && field.value !== '';

    if (label && !placeholder && hasValue) {
      labelAnimation.value = withTiming(1, {duration: 150});
    } else if (label && !placeholder && !hasValue) {
      labelAnimation.value = withTiming(0, {duration: 150});
    }
  }, [field.value, label, placeholder]);

  const labelWrapperStyle = useAnimatedStyle(() => ({
    top: withTiming(
      interpolate(
        labelAnimation.value,
        [0, 1],
        [INITIAL_POSITION, FINAL_POSITION],
      ),
      {duration: 150},
    ),
  }));

  const labelFontSizeStyle = useAnimatedStyle(() => ({
    fontSize: withTiming(
      interpolate(
        labelAnimation.value,
        [0, 1],
        [LABEL_FONT_SIZE_MEDIUM, LABEL_FONT_SIZE_SMALL],
      ),
      {duration: 150},
    ),
  }));

  const handleFocus = () => {
    if (label && !placeholder) {
      labelAnimation.value = 1;
    }
    // Mark field as touched using field.onBlur()
    field.onBlur();
    onInputFocus?.();
  };

  const onFocus = () => {
    ref.current?.focus();
  };

  const handleBlur = () => {
    if (label && !placeholder && (!field.value || field.value.trim() === '')) {
      labelAnimation.value = 0;
    }
    field.onBlur();
  };

  return (
    <Pressable onPress={onFocus} style={[{width: '100%'}, containerStyle]}>
      <View
        style={[
          {flexDirection: 'row'},
          {width: '100%'},
          {alignItems: 'center'},
        ]}>
        <Animated.View
          layout={LinearTransition}
          style={[
            {width: props.isVerification ? '80%' : '100%'},
            {flexDirection: 'row'},
            {
              backgroundColor: Colors.white,
              paddingHorizontal: scale(10),
              borderRadius: scale(10),
            },
            label ? {paddingVertical: scale(10)} : {paddingVertical: scale(6)},
            {
              borderWidth: 1,
              borderColor: errorText ? Colors.red : Colors.gray300,
              height: label ? scale(56) : scale(50),
            },
            isTextArea && [
              {alignItems: 'flex-start'},
              {height: scale(183), paddingVertical: scale(16)},
            ],
            inputContainerStyle,
          ]}>
          <View style={[{flex: 1}, {flexDirection: 'row'}]}>
            <Animated.View
              style={[
                {position: 'absolute'},
                label && placeholder ? {top: 0} : labelWrapperStyle,
              ]}>
              {label && !placeholder && (
                <Animated.Text
                  style={[
                    styles.label,
                    {fontFamily: getFontFamily('regular')},
                    {color: Colors.gray600},
                    isDisabled && {opacity: 0.5},
                    labelFontSizeStyle,
                  ]}>
                  {label}
                  {required && (
                    <CustomText
                      fontType="medium"
                      size={12}
                      textColor={Colors.primary}>
                      {' '}
                      *
                    </CustomText>
                  )}
                </Animated.Text>
              )}
              {label && placeholder && (
                <CustomText
                  fontType="regular"
                  size={12}
                  textColor={labelColor ?? Colors.text}
                  style={[isDisabled && {opacity: 0.5}]}>
                  {label}
                  {required && (
                    <CustomText
                      fontType="medium"
                      size={12}
                      textColor={Colors.red}>
                      {' '}
                      *
                    </CustomText>
                  )}
                </CustomText>
              )}
            </Animated.View>
            <TouchableOpacity
              style={[
                {flex: 1},
                {
                  justifyContent: label ? 'flex-end' : 'center',
                },
              ]}
              onPress={() => {
                if (isDatePicker) {
                  handleFocus();
                  calendarPickerRef.current?.open();
                }
              }}
              disabled={!isDatePicker || isDisabled}>
              <View style={[{flexDirection: 'row'}, {alignItems: 'center'}]}>
                {leftIconComponent && (
                  <View style={[{marginRight: scale(8)}]}>
                    {leftIconComponent}
                  </View>
                )}
                <TextInput
                  ref={ref}
                  style={[
                    {flex: 1},
                    {
                      color: Colors.gray700,
                      fontSize: moderateScale(16),
                    },
                    styles.input,
                    isTextArea && styles.textArea,
                    isTextArea && {
                      marginHorizontal: scale(-16),
                      paddingHorizontal: scale(16),
                    },
                    {
                      marginTop:
                        (isTextArea || isDatePicker) && label
                          ? INITIAL_POSITION + scale(4)
                          : 0,
                    },
                    inputStyle,
                  ]}
                  value={field.value}
                  onChangeText={text => {
                    field.onChange(text);
                    field.onBlur();
                    onChangeText?.(text);
                  }}
                  allowFontScaling={false}
                  onFocus={handleFocus}
                  onBlur={event => {
                    handleBlur();
                    onBlur?.(event);
                  }}
                  placeholder={placeholder}
                  placeholderTextColor={Colors.gray800}
                  editable={!isDatePicker && !isDisabled}
                  keyboardType={isNumberInput ? 'numeric' : 'default'}
                  autoCapitalize={
                    label?.toLowerCase().includes('email') ||
                    controller.name.toLowerCase().includes('password') ||
                    secureTextEntry
                      ? 'none'
                      : 'sentences'
                  }
                  pointerEvents={isDatePicker ? 'none' : 'auto'}
                  secureTextEntry={secureTextEntry && !showPassword}
                  multiline={isTextArea}
                  {...restProps}
                />
                {secureTextEntry ? (
                  <Pressable
                    onPress={togglePasswordVisibility}
                    style={[{marginLeft: scale(8)}]}>
                    <Icon
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={24}
                      type="ionicon"
                      color={Colors.gray700}
                    />
                  </Pressable>
                ) : (
                  rightIconComponent && (
                    <View style={[{marginLeft: scale(8)}]}>
                      {rightIconComponent}
                    </View>
                  )
                )}
              </View>
            </TouchableOpacity>

            {isDatePicker && (
              <View style={[{alignSelf: 'center'}]}>
                <CalendarPicker
                  ref={calendarPickerRef}
                  onDateSelect={handleDateSelect}
                  initialDate={getInitialDate()}
                  isDisabled={isDisabled}
                  {...calendarPickerProps}
                />
              </View>
            )}
          </View>

          {!isDatePicker && isValid && isShowValidIcon && (
            <Animated.View
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(300)}
              style={[{alignItems: 'center'}, {marginLeft: scale(8)}]}>
              <Image
                source={require('../../../assets/images/icon_circle_checked.webp')}
                style={[{width: CHECKED_ICON_SIZE, height: CHECKED_ICON_SIZE}]}
              />
            </Animated.View>
          )}
        </Animated.View>
      </View>
      {helperText && (
        <CustomText
          fontType="regular"
          size={14}
          textColor={Colors.gray600}
          style={[{marginTop: scale(4)}, helperTextStyle]}>
          {helperText}
        </CustomText>
      )}
      {errorText && (
        <CustomText
          fontType="medium"
          size={14}
          textColor={Colors.red}
          style={[
            {marginTop: scale(4), paddingHorizontal: scale(10)},
            errorTextStyle,
          ]}>
          {errorText}
        </CustomText>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  label: {
    // textTransform: 'uppercase',
  },
  textUppercase: {
    textTransform: 'uppercase',
  },
  input: {
    fontFamily: getFontFamily('regular'),
    padding: 0,
  },
  textArea: {
    textAlignVertical: 'top',
  },
  textUnderline: {
    textDecorationLine: 'underline',
  },
});
