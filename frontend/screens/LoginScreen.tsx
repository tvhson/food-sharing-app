/* eslint-disable react-native/no-inline-styles */
import {Icon, Button} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {createNotifications} from 'react-native-notificated';
import Animated, {FadeInDown, FadeInUp} from 'react-native-reanimated';
import {login} from '../api/LoginApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {setStatus} from '../redux/LoadingReducer';
import {setToken} from '../redux/TokenReducer';
import {enableScreens} from 'react-native-screens';
import {RootState} from '../redux/Store';
import AppLoader from '../components/ui/AppLoader';
import Colors from '../global/Color';

enableScreens();

const {useNotifications} = createNotifications();

const LoginScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const {notify} = useNotifications();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const isLoading = useSelector((state: RootState) => state.loading.status);

  //test crashlytics
  // useEffect(() => {
  //   crashlytics().log('Login mounted.');
  // }, []);

  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleLogin = async () => {
    //console.log(email, password);
    if (email === '' || password === '') {
      notify('error', {
        params: {description: 'Please fill all fields.', title: 'Error'},
      });
      return;
    }
    if (!validateEmail(email)) {
      notify('error', {
        params: {description: 'Invalid email.', title: 'Error'},
      });
      return;
    }
    try {
      dispatch(setStatus(true));
      await login({email, password})
        .then((response: any) => {
          console.log(response);

          if (response.status === 200) {
            //test crashlytics
            // crashlytics().log('Login success.');
            // crashlytics().setUserId(email);
            // crashlytics().setAttributes({
            //   email: email,
            //   password: password,
            // });
            // crashlytics().crash();
            if (response.data) {
              const token: any = response.data;
              console.log(response);
              AsyncStorage.setItem('token', token.accessToken);
              AsyncStorage.setItem('isLogin', 'true');
              dispatch(setToken(token.accessToken));
              navigation.navigate('Loading', {
                token: token.accessToken,
              });
            } else {
              notify('error', {
                params: {
                  description: response.data.message || 'Login failed.',
                  title: 'Error',
                  style: {multiline: 100},
                },
              });
            }
          } else {
            notify('error', {
              params: {
                description: response.data.message || 'Login failed.',
                title: 'Error',
                style: {multiline: 100},
              },
            });
          }
        })
        .catch(error => {
          notify('error', {
            params: {
              description: error.message || 'Login failed.',
              title: 'Error',
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
          title: 'Error',
          style: {multiline: 100},
        },
      });
    }
  };

  useEffect(() => {
    setEmail('');
    setPassword('');
  }, []);
  if (isLoading) {
    return <AppLoader />;
  }

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        //dismiss keyboard
        Keyboard.dismiss();
      }}>
      <View style={styles.container}>
        <Image
          source={require('../assets/images/LoginBackground.png')}
          style={styles.background}
        />
        <View
          style={{
            flex: 1,
            position: 'absolute',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
          }}>
          <Icon
            name="arrow-back"
            type="ionicons"
            size={30}
            onPress={() => navigation.goBack()}
            style={{
              alignItems: 'flex-start',
              marginTop: 20,
              marginLeft: 20,
              width: 30,
              height: 30,
              color: 'black',
            }}
          />
          <Animated.View
            entering={FadeInUp.delay(200).duration(1000).springify()}
            style={{alignSelf: 'center'}}>
            <Text
              style={{
                fontSize: 46,
                fontWeight: 'bold',
                color: 'white',
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
                  fontSize: 20,
                  color: 'white',
                  textDecorationLine: 'underline',
                }}>
                Chưa có tài khoản? Đăng ký ngay
              </Text>
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            entering={FadeInUp.delay(400).duration(1000).springify()}
            style={{marginTop: 130, alignItems: 'center'}}>
            <TextInput
              placeholder="Email"
              placeholderTextColor={'#706d6d'}
              style={{
                fontSize: 16,
                padding: 10,
                backgroundColor: '#eff2ff',
                borderRadius: 8,
                width: '90%',
                color: 'black',
              }}
              onChangeText={setEmail}
            />
          </Animated.View>
          <Animated.View
            entering={FadeInUp.delay(500).duration(1000).springify()}
            style={{marginTop: 20, alignItems: 'center'}}>
            <View
              style={{
                padding: 10,
                paddingVertical: 0,
                backgroundColor: '#eff2ff',
                borderRadius: 8,
                width: '90%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TextInput
                placeholder="Mật khẩu"
                placeholderTextColor={'#706d6d'}
                style={{
                  fontSize: 16,
                  color: 'black',
                  width: '90%',
                }}
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => {
                  setShowPassword(!showPassword);
                }}>
                <Icon
                  name={showPassword ? 'eye' : 'eye-with-line'}
                  type="entypo"
                  size={24}
                  color={'#706d6d'}
                />
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(400).duration(1000).springify()}
            style={{
              marginTop: 220,
              alignItems: 'center',
              width: '100%',
            }}>
            <Button
              title="Đăng nhập"
              onPress={handleLogin}
              titleStyle={{fontWeight: '700', fontSize: 20}}
              buttonStyle={{
                backgroundColor: Colors.greenPrimary,
                borderColor: 'transparent',
                borderWidth: 0,
                borderRadius: 30,
                width: 300,
              }}
            />
          </Animated.View>
        </View>
      </View>
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
