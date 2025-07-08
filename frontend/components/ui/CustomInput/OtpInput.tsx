import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeOut,
  interpolateColor,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {getFontFamily} from '../../../utils/fonts';
import {moderateScale, scale} from '../../../utils/scale';
import screenWidth from '../../../global/Constant';
import Colors from '../../../global/Color';

export interface IOtpInput {
  /**
   * Digits of pins in the OTP
   */
  otpCount: number;
  /**
   * Style of the container
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Style of the input container
   */
  inputContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Style of the input fields
   */
  inputStyle?: StyleProp<TextStyle>;
  /**
   * Style of the input mask
   */
  inputMaskStyle?: StyleProp<ViewStyle>;
  /**
   * Style of text for input fields
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * Color of border color when focused
   */
  focusColor?: string;
  /**
   * If keyboard is automatically brought up when OTP is loaded.
   */
  autoFocus?: boolean;
  /**
   * Set editable for inputs
   */
  editable?: boolean;
  /**
   * Callback function
   * Trigger when all text input fields are fulfill
   */
  onCodeFilled?: (code: string) => void;
  /**
   * Callback function
   * Trigger when a field of the OTP is changed
   */
  onCodeChanged?: (codes: string) => void;
  /**
   * Entering animation using reanimated layout
   */
  enteringAnimated?: typeof LinearTransition;
  /**
   * Exiting animation using reanimated layout
   */
  exitingAnimated?: typeof LinearTransition;
  /**
   * If the input is an error
   */
  isOnlyBorderBottom?: boolean;
  /**
   * If the input is only border bottom
   */
  caretHidden?: boolean;
  /**
   * If the caret is hidden
   */
  isError?: boolean;
  /**
   * Default value for OTP input
   */
  defaultValue?: string;
}

export interface IOtpContext extends IOtpInput {
  inputRef: React.MutableRefObject<any[]>;
  otpValue: string[];
  onPress: () => void;
  onFocusNext: (value: string, index: number) => void;
  onFocusPrevious: (key: string, index: number) => void;
  setFocus: React.Dispatch<React.SetStateAction<number>>;
  setOtpValue: React.Dispatch<React.SetStateAction<string[]>>;
  focus: number;
  autoFocus: boolean;
  currentIndex: number;
  isOnlyBorderBottom: boolean;
  isError: boolean;
  caretHidden: boolean;
  rest?: Omit<TextInputProps, 'style'>;
}

const OtpContext = createContext<IOtpContext>({} as IOtpContext);

const OtpItem = ({i}: {i: number}) => {
  const {
    inputRef,
    onPress,
    otpValue,
    onFocusNext,
    onFocusPrevious,
    setFocus,
    setOtpValue,
    focus,
    focusColor,
    autoFocus,
    inputContainerStyle,
    inputStyle,
    inputMaskStyle,
    textStyle,
    otpCount,
    editable,
    enteringAnimated,
    exitingAnimated,
    isOnlyBorderBottom,
    caretHidden,
    isError,
    rest,
  } = useContext(OtpContext);

  const CustomInput = TextInput;

  const inputWidth = (screenWidth - scale(78)) / otpCount;

  const isFocused = useSharedValue(0);

  useEffect(() => {
    isFocused.value = withTiming(focus === i ? 1 : 0, {duration: 150});
  }, [focus]);

  const borderStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      isFocused.value,
      [0, 1],
      [Colors.gray300, Colors.gray600],
    );
    return {
      borderColor: isError ? Colors.red : borderColor,
      borderWidth: isOnlyBorderBottom ? 0 : 1,
      borderBottomWidth: 1,
    };
  }, [focus, isFocused, isError]);

  useEffect(() => {
    if (otpValue) {
      if ((otpValue[i]?.length ?? 0) > 1) {
        const format = otpValue[i]?.substring(0, otpCount);
        const numbers = format?.split('') ?? [];
        setOtpValue(numbers);
        setFocus(-1);
      }
    }
  }, [otpValue]);

  return (
    <View key={i} style={[inputContainerStyle]}>
      <CustomInput
        style={[{width: inputWidth, height: inputWidth}, inputStyle]}
        caretHidden={caretHidden}
        keyboardType="number-pad"
        ref={inputRef.current[i]}
        value={otpValue[i]}
        onChangeText={v => onFocusNext(v, i)}
        onKeyPress={e => onFocusPrevious(e.nativeEvent.key, i)}
        textContentType="oneTimeCode"
        autoFocus={autoFocus && i === 0}
        {...rest}
      />
      <Pressable disabled={!editable} onPress={onPress} style={styles.overlay}>
        <Animated.View
          style={[
            {alignItems: 'center', justifyContent: 'center'},
            {
              width: inputWidth,
              height: inputWidth,
            },
            styles.input,
            borderStyle,
            inputMaskStyle,
          ]}>
          {otpValue[i] !== '' && (
            <Animated.Text
              entering={enteringAnimated}
              exiting={exitingAnimated}
              style={[
                styles.text,
                {color: Colors.primary, fontSize: moderateScale(28)},
                textStyle,
              ]}>
              {otpValue[i]}
            </Animated.Text>
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
};

export const OtpInput = ({
  otpCount = 6,
  containerStyle = {},
  inputContainerStyle = {},
  inputStyle = {},
  inputMaskStyle = {},
  textStyle = {},
  focusColor = '#D5B266',
  autoFocus = false,
  editable = true,
  enteringAnimated = FadeInDown,
  exitingAnimated = FadeOut,
  onCodeFilled,
  onCodeChanged,
  isError = false,
  isOnlyBorderBottom = false,
  caretHidden = true,
  defaultValue = '',
  ...rest
}: IOtpInput) => {
  const inputRef = useRef<any[]>([]);
  const data: string[] = new Array(otpCount).fill('');

  inputRef.current = data.map(
    (_, index) => (inputRef.current[index] = React.createRef<TextInput>()),
  );

  const [focus, setFocus] = useState<number>(
    defaultValue && defaultValue.length === otpCount ? -1 : 0,
  );

  const [otpValue, setOtpValue] = useState<string[]>(() => {
    if (defaultValue) {
      const values = defaultValue.split('').slice(0, otpCount);
      if (values.length === otpCount) {
        setTimeout(() => {
          onCodeFilled?.(defaultValue);
        }, 0);
      }
      return values.concat(data.slice(defaultValue.length));
    }
    return data;
  });

  const shouldAutoFocus = autoFocus && !defaultValue;

  const onPress = () => {
    if (focus === -1) {
      setFocus(otpCount - 1);
      otpValue[data.length - 1] = '';
      setOtpValue([...otpValue]);
      inputRef.current[data.length - 1].current.focus();
    } else {
      inputRef.current[focus].current.focus();
    }
  };

  const onFocusNext = (value: string, index: number) => {
    if (index < data.length - 1 && value) {
      inputRef.current[index + 1].current.focus();
      setFocus(index + 1);
    }
    if (index === data.length - 1) {
      setFocus(-1);
      inputRef.current[index].current.blur();
    }
    otpValue[index] = value;
    setOtpValue([...otpValue]);
  };

  const onFocusPrevious = (key: string, index: number) => {
    if (key === 'Backspace' && index !== 0) {
      inputRef.current[index - 1].current.focus();
      setFocus(index - 1);
      otpValue[index - 1] = '';
      setOtpValue([...otpValue]);
    } else if (key === 'Backspace' && index === 0) {
      otpValue[0] = '';
    }
  };
  if (otpCount < 4 && otpCount > 6) {
    throw 'OTP Count min is 4 and max is 6';
  }
  const inputProps = {
    inputRef,
    containerStyle,
    otpValue,
    onPress,
    onFocusNext,
    onFocusPrevious,
    setFocus,
    setOtpValue,
    focus,
    autoFocus: shouldAutoFocus,
    inputContainerStyle,
    inputStyle,
    inputMaskStyle,
    textStyle,
    focusColor,
    otpCount,
    editable,
    enteringAnimated,
    exitingAnimated,
    isError,
    isOnlyBorderBottom,
    caretHidden,
    rest,
  };

  useEffect(() => {
    onCodeChanged && onCodeChanged(otpValue.join(''));
    if (
      otpValue &&
      Number(otpValue.join('').length === otpCount) &&
      onCodeFilled
    ) {
      onCodeFilled(otpValue.join(''));
    }
  }, [otpValue]);

  return (
    <OtpContext.Provider
      value={
        {
          ...inputProps,
          autoFocus: shouldAutoFocus,
        } as IOtpContext
      }>
      <View
        style={[
          {flexDirection: 'row', alignItems: 'center', marginVertical: 16},
          {gap: scale(12)},
          containerStyle,
        ]}>
        {data.map((_, i) => {
          return <OtpItem key={i} i={i} />;
        })}
      </View>
    </OtpContext.Provider>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontWeight: '600',
    fontFamily: getFontFamily('regular'),
  },
  overlay: {
    position: 'absolute',
  },
});
