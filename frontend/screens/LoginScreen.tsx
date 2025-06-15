import Animated, {FadeInDown, FadeInUp} from 'react-native-reanimated';
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
import {useDispatch, useSelector} from 'react-redux';

import AppLoader from '../components/ui/AppLoader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../global/Color';
import {RootState} from '../redux/Store';
import {createNotifications} from 'react-native-notificated';
import {enableScreens} from 'react-native-screens';
import {login} from '../api/LoginApi';
import {setStatus} from '../redux/LoadingReducer';
import {setToken} from '../redux/TokenReducer';
import {createLoginValidate, LoginValidateSchema} from '../utils/schema/login';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {CustomInput} from '../components/ui/CustomInput/CustomInput';
import {moderateScale, scale} from '../utils/scale';
import {getFontFamily} from '../utils/fonts';

enableScreens();

const {useNotifications} = createNotifications();

const LoginScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const {notify} = useNotifications();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginValidateSchema>({
    resolver: zodResolver(createLoginValidate()),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  const isLoading = useSelector((state: RootState) => state.loading.status);

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleLogin = async (data: LoginValidateSchema) => {
    try {
      dispatch(setStatus(true));
      await login({email: data.email, password: data.password})
        .then((response: any) => {
          console.log(response);

          if (response.status === 200) {
            if (response.data) {
              AsyncStorage.setItem('token', response.data.accessToken);
              AsyncStorage.setItem('isLogin', 'true');
              dispatch(setToken(response.data.accessToken));
              navigation.navigate('Loading', {
                token: response.data.accessToken,
              });
            } else {
              notify('error', {
                params: {
                  description: response.data.message || 'Login failed.',
                  title: 'Lỗi',
                  style: {multiline: 100},
                },
              });
            }
          } else {
            notify('error', {
              params: {
                description: response.data.message || 'Login failed.',
                title: 'Lỗi',
                style: {multiline: 100},
              },
            });
          }
        })
        .catch(error => {
          notify('error', {
            params: {
              description: error.message || 'Login failed.',
              title: 'Lỗi',
              style: {multiline: 100},
            },
          });
        })
        .finally(() => {
          dispatch(setStatus(false));
        });
    } catch (error: any) {
      notify('error', {
        params: {
          description: error.message || 'Login failed.',
          title: 'Lỗi',
          style: {multiline: 100},
        },
      });
    }
  };

  if (isLoading) {
    return <AppLoader />;
  }

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
                  fontSize: moderateScale(46),
                  color: 'white',
                  fontFamily: getFontFamily('bold'),
                  textAlign: 'center',
                }}>
                Chào mừng!{'\n '}Đăng nhập
              </Text>
            </Animated.View>
            <Animated.View
              entering={FadeInUp.delay(300).duration(1000).springify()}
              style={{alignSelf: 'center'}}>
              <TouchableOpacity onPress={handleRegister}>
                <Text
                  style={{
                    fontSize: moderateScale(20),
                    color: 'white',
                    textDecorationLine: 'underline',
                    fontFamily: getFontFamily('regular'),
                  }}>
                  Chưa có tài khoản? Đăng ký ngay
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
                    name: 'email',
                  }}
                  labelColor={Colors.gray600}
                  errorText={errors.email?.message}
                  label="Email"
                  keyboardType="email-address"
                />
              </View>
            </Animated.View>
            <Animated.View
              entering={FadeInUp.delay(500).duration(1000).springify()}
              style={{marginTop: 20, alignItems: 'center'}}>
              <View style={{paddingHorizontal: scale(16)}}>
                <CustomInput
                  labelColor={Colors.gray600}
                  controller={{
                    control,
                    name: 'password',
                  }}
                  errorText={errors.password?.message}
                  label="Mật khẩu"
                  secureTextEntry
                />
              </View>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.delay(400).duration(1000).springify()}
              style={{
                marginTop: scale(170),
                alignItems: 'center',
                width: '100%',
              }}>
              <Button
                title="Đăng nhập"
                onPress={handleSubmit(handleLogin)}
                titleStyle={{
                  fontWeight: '700',
                  fontSize: moderateScale(20),
                  fontFamily: getFontFamily('bold'),
                }}
                buttonStyle={{
                  backgroundColor: Colors.greenPrimary,
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

export default LoginScreen;
