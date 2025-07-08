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

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');

  const forgotPasswordMutation = useForgotPassword();
  const verifyOtpMutation = useVerifyOtp();
  const resetPasswordMutation = useResetPassword();

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      const result = await forgotPasswordMutation.mutateAsync(email);
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
      const result = await verifyOtpMutation.mutateAsync({email, otp});
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
        setEmail('');
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
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleForgotPassword}
        disabled={forgotPasswordMutation.isPending}>
        <Text style={styles.buttonText}>
          {forgotPasswordMutation.isPending ? 'Sending...' : 'Send OTP'}
        </Text>
      </TouchableOpacity>
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
      <Text style={styles.title}>Reset Password</Text>
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
