import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  useForgotPassword,
  useVerifyOtp,
  useResetPassword,
} from '../../api/usePasswordReset';
import Animated, {FadeInDown, FadeInUp} from 'react-native-reanimated';
import {moderateScale, scale} from '../../utils/scale';
import {getFontFamily} from '../../utils/fonts';
import {CustomInput} from './CustomInput/CustomInput';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {
  createForgotPasswordValidate,
  createResetPasswordValidate,
  ForgotPasswordValidateSchema,
  ResetPasswordValidateSchema,
} from '../../utils/schema/forgot-password';
import {Button} from '@rneui/themed';
import Colors from '../../global/Color';
import {useNotifications} from 'react-native-notificated';
import {OtpInput} from './CustomInput/OtpInput';
import {useLoading} from '../../utils/LoadingContext';
import {CustomText} from './CustomText';
import {useNavigation} from '@react-navigation/native';
import {Route} from '../../constants/route';

const ForgotPasswordForm = () => {
  const {showLoading, hideLoading} = useLoading();
  const navigation: any = useNavigation();

  const [otp, setOtp] = useState('');
  const [errorOtp, setErrorOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const {notify} = useNotifications();

  const {
    mutateAsync: forgotPasswordMutation,
    isPending: isForgotPasswordPending,
  } = useForgotPassword();
  const {mutateAsync: verifyOtpMutation, isPending: isVerifyOtpPending} =
    useVerifyOtp();
  const {
    mutateAsync: resetPasswordMutation,
    isPending: isResetPasswordPending,
  } = useResetPassword();

  const {
    control,
    handleSubmit,
    getValues,
    formState: {errors},
  } = useForm<ForgotPasswordValidateSchema>({
    resolver: zodResolver(createForgotPasswordValidate()),
    mode: 'onChange',
    defaultValues: {
      username: '',
    },
  });

  const {
    control: controlResetPassword,
    handleSubmit: handleSubmitResetPassword,
    getValues: getValuesResetPassword,
    formState: {errors: errorsResetPassword},
  } = useForm<ResetPasswordValidateSchema>({
    resolver: zodResolver(createResetPasswordValidate()),
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const email = getValues('username');

  const handleForgotPassword = async (data: ForgotPasswordValidateSchema) => {
    try {
      showLoading();
      const result = await forgotPasswordMutation(data.username);
      if (
        result &&
        typeof result === 'object' &&
        'status' in result &&
        result.status === 200
      ) {
        hideLoading();
        setStep('otp');
        notify('success', {
          params: {
            description: 'OTP đã được gửi đến email của bạn',
            title: 'Thành công',
            style: {
              multiline: 100,
            },
          },
        });
      } else {
        hideLoading();
        const errorMessage =
          result &&
          typeof result === 'object' &&
          'data' in result &&
          result.data &&
          typeof result.data === 'object' &&
          'message' in result.data
            ? String(result.data.message)
            : 'Lỗi khi gửi OTP';
        notify('error', {
          params: {
            description: errorMessage,
            title: 'Lỗi',
            style: {
              multiline: 100,
            },
          },
        });
      }
    } catch (error) {
      hideLoading();
      notify('error', {
        params: {
          description: 'Lỗi khi gửi OTP',
          title: 'Lỗi',
          style: {
            multiline: 100,
          },
        },
      });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setErrorOtp('Vui lòng nhập OTP');
      return;
    }

    try {
      showLoading();
      const result = await verifyOtpMutation({
        email,
        otp,
      });
      if (
        result &&
        typeof result === 'object' &&
        'status' in result &&
        result.status === 200
      ) {
        hideLoading();
        setStep('password');
        notify('success', {
          params: {
            description: 'OTP đã được xác thực',
            title: 'Thành công',
          },
        });
      } else {
        hideLoading();
        const errorMessage =
          result &&
          typeof result === 'object' &&
          'data' in result &&
          result.data &&
          typeof result.data === 'object' &&
          'message' in result.data
            ? String(result.data.message)
            : 'OTP không hợp lệ';
        notify('error', {
          params: {
            description: errorMessage,
            title: 'Lỗi',
            style: {
              multiline: 100,
            },
          },
        });
      }
    } catch (error) {
      hideLoading();
      notify('error', {
        params: {
          description: 'Lỗi khi xác thực OTP',
          title: 'Lỗi',
          style: {
            multiline: 100,
          },
        },
      });
    }
  };

  const handleResetPassword = async (data: ResetPasswordValidateSchema) => {
    try {
      showLoading();
      const result = await resetPasswordMutation({
        email,
        newPassword: data.newPassword,
      });
      if (
        result &&
        typeof result === 'object' &&
        'status' in result &&
        result.status === 200
      ) {
        hideLoading();
        notify('success', {
          params: {
            description: 'Mật khẩu đã được đặt lại',
            title: 'Thành công',
            style: {
              multiline: 100,
            },
          },
        });
        navigation.navigate(Route.Login);
        setStep('email');
        setOtp('');
      } else {
        hideLoading();
        const errorMessage =
          result &&
          typeof result === 'object' &&
          'data' in result &&
          result.data &&
          typeof result.data === 'object' &&
          'message' in result.data
            ? String(result.data.message)
            : 'Lỗi khi đặt lại mật khẩu';
        notify('error', {
          params: {
            description: errorMessage,
            title: 'Lỗi',
            style: {
              multiline: 100,
            },
          },
        });
      }
    } catch (error) {
      hideLoading();
      notify('error', {
        params: {
          description: 'Lỗi khi đặt lại mật khẩu',
          title: 'Lỗi',
          style: {
            multiline: 100,
          },
        },
      });
    }
  };

  const renderEmailStep = () => (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInUp.delay(200).duration(1000).springify()}
        style={{alignSelf: 'center'}}>
        <Text
          style={{
            fontSize: moderateScale(46),
            color: 'white',
            fontFamily: getFontFamily('bold'),
            textAlign: 'center',
          }}>
          Quên mật khẩu
        </Text>
      </Animated.View>
      <Animated.View
        entering={FadeInUp.delay(400).duration(1000).springify()}
        style={{marginTop: scale(80), alignItems: 'center'}}>
        <View style={{paddingHorizontal: scale(16)}}>
          <CustomInput
            controller={{
              control,
              name: 'username',
            }}
            labelColor={Colors.gray600}
            errorText={errors.username?.message}
            label="Email"
            keyboardType="email-address"
          />
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(400).duration(1000).springify()}
        style={{
          marginTop: scale(30),
          alignItems: 'center',
          width: '100%',
        }}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(handleForgotPassword)}
          disabled={isForgotPasswordPending}>
          <Text style={styles.buttonText}>{'Gửi mã OTP'}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );

  const renderOtpStep = () => (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInUp.delay(200).duration(1000).springify()}
        style={{alignSelf: 'center'}}>
        <Text
          style={{
            fontSize: moderateScale(46),
            color: 'white',
            fontFamily: getFontFamily('bold'),
            textAlign: 'center',
          }}>
          Nhập mã OTP
        </Text>
      </Animated.View>
      <Animated.View
        entering={FadeInUp.delay(200).duration(1000).springify()}
        style={{alignSelf: 'center'}}>
        <Text
          style={{
            fontSize: moderateScale(20),
            color: 'white',
            fontFamily: getFontFamily('bold'),
            textAlign: 'center',
          }}>
          OTP đã được gửi đến {email}
        </Text>
      </Animated.View>
      <Animated.View
        entering={FadeInUp.delay(200).duration(1000).springify()}
        style={{alignSelf: 'center'}}>
        <OtpInput
          otpCount={6}
          onCodeChanged={code => {
            setOtp(code);
            setErrorOtp('');
          }}
          autoFocus
          containerStyle={{
            gap: scale(6),
          }}
          inputMaskStyle={{
            borderWidth: 1,
            borderColor: 'white',
            borderRadius: scale(10),
          }}
        />
        {errorOtp && (
          <CustomText
            size={14}
            style={{
              color: Colors.red,
              marginTop: scale(4),
              textAlign: 'center',
            }}>
            {errorOtp}
          </CustomText>
        )}
      </Animated.View>
      <Animated.View
        entering={FadeInUp.delay(200).duration(1000).springify()}
        style={{alignSelf: 'center'}}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleVerifyOtp}
          disabled={isVerifyOtpPending}>
          <Text style={styles.buttonText}>{'Xác thực OTP'}</Text>
        </TouchableOpacity>
      </Animated.View>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setStep('email')}>
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>
    </View>
  );

  const renderPasswordStep = () => (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInUp.delay(200).duration(1000).springify()}
        style={{alignSelf: 'center'}}>
        <Text
          style={{
            fontSize: moderateScale(46),
            color: 'white',
            fontFamily: getFontFamily('bold'),
            textAlign: 'center',
          }}>
          Đặt lại mật khẩu
        </Text>
      </Animated.View>
      <Animated.View
        entering={FadeInUp.delay(600).duration(1000).springify()}
        style={{marginTop: 20, alignItems: 'center'}}>
        <View style={{paddingHorizontal: scale(16)}}>
          <CustomInput
            controller={{
              control: controlResetPassword,
              name: 'newPassword',
            }}
            errorText={errorsResetPassword.newPassword?.message}
            label="Mật khẩu"
            labelColor={Colors.gray600}
            secureTextEntry
          />
        </View>
      </Animated.View>
      <Animated.View
        entering={FadeInUp.delay(600).duration(1000).springify()}
        style={{marginTop: 20, alignItems: 'center'}}>
        <View style={{paddingHorizontal: scale(16)}}>
          <CustomInput
            controller={{
              control: controlResetPassword,
              name: 'confirmPassword',
            }}
            errorText={errorsResetPassword.confirmPassword?.message}
            label="Nhập lại mật khẩu"
            labelColor={Colors.gray600}
            secureTextEntry
          />
        </View>
      </Animated.View>
      <Animated.View
        entering={FadeInUp.delay(600).duration(1000).springify()}
        style={{marginTop: 20, alignItems: 'center'}}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmitResetPassword(handleResetPassword)}
          disabled={isResetPasswordPending}>
          <Text style={styles.buttonText}>{'Đặt lại mật khẩu'}</Text>
        </TouchableOpacity>
      </Animated.View>
      <Animated.View
        entering={FadeInUp.delay(600).duration(1000).springify()}
        style={{marginTop: 20, alignItems: 'center'}}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setStep('otp')}>
          <Text style={styles.backButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );

  switch (step) {
    case 'email':
      return renderEmailStep();
    case 'otp':
      return renderOtpStep();
    case 'password':
      return renderPasswordStep();
    default:
      return renderEmailStep();
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'black',
    fontSize: 16,
  },
});

export default ForgotPasswordForm;
