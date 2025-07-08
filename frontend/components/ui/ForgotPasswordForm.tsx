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
  ForgotPasswordValidateSchema,
} from '../../utils/schema/forgot-password';
import {Button} from '@rneui/themed';
import Colors from '../../global/Color';

const ForgotPasswordForm = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');

  const forgotPasswordMutation = useForgotPassword();
  const verifyOtpMutation = useVerifyOtp();
  const resetPasswordMutation = useResetPassword();

  const {
    control,
    handleSubmit,
    getValues,
    formState: {errors},
  } = useForm<ForgotPasswordValidateSchema>({
    resolver: zodResolver(createForgotPasswordValidate()),
    defaultValues: {
      username: '',
    },
  });

  const email = getValues('username');

  const handleForgotPassword = async (data: ForgotPasswordValidateSchema) => {
    if (!data.username) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      const result = await forgotPasswordMutation.mutateAsync(data.username);
      if (
        result &&
        typeof result === 'object' &&
        'status' in result &&
        result.status === 200
      ) {
        setStep('otp');
        Alert.alert('Success', 'OTP sent to your email');
      } else {
        const errorMessage =
          result &&
          typeof result === 'object' &&
          'data' in result &&
          result.data &&
          typeof result.data === 'object' &&
          'message' in result.data
            ? String(result.data.message)
            : 'Failed to send OTP';
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter OTP');
      return;
    }

    try {
      const result = await verifyOtpMutation.mutateAsync({
        email,
        otp,
      });
      if (
        result &&
        typeof result === 'object' &&
        'status' in result &&
        result.status === 200
      ) {
        setStep('password');
        Alert.alert('Success', 'OTP verified successfully');
      } else {
        const errorMessage =
          result &&
          typeof result === 'object' &&
          'data' in result &&
          result.data &&
          typeof result.data === 'object' &&
          'message' in result.data
            ? String(result.data.message)
            : 'Invalid OTP';
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to verify OTP');
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      const result = await resetPasswordMutation.mutateAsync({
        email,
        newPassword,
      });
      if (
        result &&
        typeof result === 'object' &&
        'status' in result &&
        result.status === 200
      ) {
        Alert.alert('Success', 'Password reset successfully');
        setStep('email');
        setOtp('');
        setNewPassword('');
      } else {
        const errorMessage =
          result &&
          typeof result === 'object' &&
          'data' in result &&
          result.data &&
          typeof result.data === 'object' &&
          'message' in result.data
            ? String(result.data.message)
            : 'Failed to reset password';
        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to reset password');
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
        <Button
          title="Gửi mã OTP"
          onPress={handleSubmit(handleForgotPassword)}
          titleStyle={{
            fontWeight: '700',
            fontSize: moderateScale(20),
            fontFamily: getFontFamily('bold'),
            color: Colors.black,
          }}
          buttonStyle={{
            backgroundColor: Colors.white,
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: scale(30),
            width: scale(200),
          }}
        />
      </Animated.View>
    </View>
  );

  const renderOtpStep = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>OTP sent to {email}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleVerifyOtp}
        disabled={verifyOtpMutation.isPending}>
        <Text style={styles.buttonText}>
          {verifyOtpMutation.isPending ? 'Verifying...' : 'Verify OTP'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setStep('email')}>
        <Text style={styles.backButtonText}>Back</Text>
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
          Nhập mật khẩu mới
        </Text>
      </Animated.View>
      <TextInput
        style={styles.input}
        placeholder="Enter new password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleResetPassword}
        disabled={resetPasswordMutation.isPending}>
        <Text style={styles.buttonText}>
          {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => setStep('otp')}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
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
    color: '#007AFF',
    fontSize: 16,
  },
});

export default ForgotPasswordForm;
