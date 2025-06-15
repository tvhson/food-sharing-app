import Animated, {FadeInDown, FadeInUp} from 'react-native-reanimated';
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react-native/no-inline-styles */
import {Button, Icon} from '@rneui/themed';
import {
  Image,
  ImageBackground,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import Colors from '../global/Color';
import {createNotifications} from 'react-native-notificated';
import {register} from '../api/RegisterApi';
import {moderateScale, scale} from '../utils/scale';
import {
  createRegisterValidate,
  RegisterValidateSchema,
} from '../utils/schema/register';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {CustomInput} from '../components/ui/CustomInput/CustomInput';
import {getFontFamily} from '../utils/fonts';

const {useNotifications} = createNotifications();

const RegisterScreen = ({navigation}: any) => {
  const {notify} = useNotifications();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<RegisterValidateSchema>({
    resolver: zodResolver(createRegisterValidate()),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const handleRegister = async (data: RegisterValidateSchema) => {
    register({name: data.name, email: data.email, password: data.password})
      .then(response => {
        if (response.status === 200) {
          notify('success', {
            params: {
              description: 'Đăng ký thành công',
              title: 'Thành công',
            },
          });

          navigation.navigate('Login');
        } else {
          notify('error', {
            params: {
              description: response.data.message || 'Đăng ký thất bại.',
              title: 'Lỗi',
            },
          });
        }
      })
      .catch(error => {
        notify('error', {
          params: {
            description: error.message,
            title: 'Lỗi',
            style: {multiline: 100},
          },
        });
      });
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        //dismiss keyboard
        Keyboard.dismiss();
      }}>
      <ImageBackground
        source={require('../assets/images/LoginBackground.png')}
        style={styles.background}
        resizeMode="cover">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.container}>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              width: '100%',
              height: '100%',
            }}>
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
            <Animated.View
              entering={FadeInUp.delay(200).duration(1000).springify()}
              style={{alignSelf: 'center'}}>
              <Text
                style={{
                  fontSize: moderateScale(40),
                  fontFamily: getFontFamily('bold'),
                  color: Colors.white,
                }}>
                Tạo tài khoản mới
              </Text>
            </Animated.View>
            <Animated.View
              entering={FadeInUp.delay(300).duration(1000).springify()}
              style={{alignSelf: 'center'}}>
              <TouchableOpacity onPress={handleLogin}>
                <Text
                  style={{
                    fontSize: moderateScale(20),
                    color: Colors.white,
                    textDecorationLine: 'underline',
                    fontFamily: getFontFamily('regular'),
                  }}>
                  Đã đăng ký? Đăng nhập ngay
                </Text>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              entering={FadeInUp.delay(400).duration(1000).springify()}
              style={{marginTop: scale(80), alignItems: 'center'}}>
              <View style={{paddingHorizontal: scale(16)}}>
                <CustomInput
                  controller={{
                    control,
                    name: 'name',
                  }}
                  errorText={errors.name?.message}
                  label="Tên"
                  labelColor={Colors.gray600}
                />
              </View>
            </Animated.View>
            <Animated.View
              entering={FadeInUp.delay(400).duration(1000).springify()}
              style={{marginTop: 20, alignItems: 'center'}}>
              <View style={{paddingHorizontal: scale(16)}}>
                <CustomInput
                  controller={{
                    control,
                    name: 'email',
                  }}
                  errorText={errors.email?.message}
                  label="Email"
                  labelColor={Colors.gray600}
                  keyboardType="email-address"
                />
              </View>
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(600).duration(1000).springify()}
              style={{marginTop: 20, alignItems: 'center'}}>
              <View style={{paddingHorizontal: scale(16)}}>
                <CustomInput
                  controller={{
                    control,
                    name: 'password',
                  }}
                  errorText={errors.password?.message}
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
                    control,
                    name: 'confirmPassword',
                  }}
                  errorText={errors.confirmPassword?.message}
                  label="Nhập lại mật khẩu"
                  labelColor={Colors.gray600}
                  secureTextEntry
                />
              </View>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(400).duration(1000).springify()}
              style={{
                marginTop: scale(125),
                alignItems: 'center',
                width: '100%',
              }}>
              <Button
                title="Đăng ký"
                onPress={handleSubmit(handleRegister)}
                titleStyle={{
                  fontWeight: '700',
                  fontSize: moderateScale(20),
                  fontFamily: getFontFamily('bold'),
                }}
                buttonStyle={{
                  backgroundColor: Colors.button,
                  borderColor: 'transparent',
                  borderWidth: 0,
                  borderRadius: scale(30),
                  width: scale(300),
                }}
              />
            </Animated.View>
          </View>
        </ScrollView>
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  background: {
    width: '100%',
    height: '100%',
  },
});

export default RegisterScreen;
