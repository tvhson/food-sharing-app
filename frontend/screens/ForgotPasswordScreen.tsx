import {
  ImageBackground,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import ForgotPasswordForm from '../components/ui/ForgotPasswordForm';
import {Icon} from '@rneui/themed';
import Colors from '../global/Color';
import {scale} from '../utils/scale';

const ForgotPasswordScreen = ({navigation}: any) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}>
      <ImageBackground
        source={require('../assets/images/LoginBackground.png')}
        style={styles.background}
        resizeMode="cover">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.container}>
          <Icon
            name="arrow-back"
            type="ionicons"
            size={30}
            color={Colors.white}
            onPress={() => navigation.goBack()}
            style={{
              alignItems: 'flex-start',
              marginTop: scale(20),
              marginLeft: scale(20),
              width: scale(30),
              height: scale(30),
            }}
          />
          <ForgotPasswordForm />
        </ScrollView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
});
