/* eslint-disable @typescript-eslint/no-shadow */
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
} from 'react-native';
import Animated, {FadeInDown, FadeInUp} from 'react-native-reanimated';
import Colors from '../global/Color';
import {createNotifications} from 'react-native-notificated';
import {register} from '../api/RegisterApi';

const {useNotifications} = createNotifications();

const RegisterScreen = ({navigation}: any) => {
  const {notify} = useNotifications();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  const validatePassword = (password: string) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return re.test(String(password));
  };
  const validateConfirmPassword = (
    password: string,
    confirmPassword: string,
  ) => {
    return password === confirmPassword;
  };
  const handleRegister = async () => {
    if (
      name === '' ||
      username === '' ||
      password === '' ||
      confirmPassword === ''
    ) {
      notify('error', {
        params: {
          description: 'Vui lòng nhập hết tất cả thông tin',
          title: 'Lỗi',
        },
      });
      return;
    }
    if (!validateEmail(username)) {
      notify('error', {
        params: {
          description: 'Email không hợp lệ.',
          title: 'Lỗi',
        },
      });
      return;
    }

    if (!validatePassword(password)) {
      notify('error', {
        params: {
          description:
            'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái và số.',
          title: 'Lỗi',
          style: {multiline: 100},
        },
      });
      return;
    }
    if (!validateConfirmPassword(password, confirmPassword)) {
      notify('error', {
        params: {
          description: 'Mật khẩu không khớp.',
          title: 'Lỗi',
        },
      });
      return;
    }
    const email: string = username;
    register({name, email, password})
      .then(response => {
        if (response.status === 200) {
          notify('success', {
            params: {
              description: 'Đăng ký thành công',
              title: 'Thành công',
            },
          });
          setName('');
          setUsername('');
          setPassword('');
          setConfirmPassword('');
          setShowPassword(false);
          setShowConfirmPassword(false);
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
    setName('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    navigation.navigate('Login');
  };
  useEffect(() => {
    setName('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  }, []);

  return (
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
            Tạo tài khoản mới
          </Text>
        </Animated.View>
        <Animated.View
          entering={FadeInUp.delay(300).duration(1000).springify()}
          style={{alignSelf: 'center'}}>
          <TouchableOpacity onPress={handleLogin}>
            <Text
              style={{
                fontSize: 20,
                color: 'white',
                textDecorationLine: 'underline',
              }}>
              Đã đăng ký? Đăng nhập ngay
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          entering={FadeInUp.delay(400).duration(1000).springify()}
          style={{marginTop: 85, alignItems: 'center'}}>
          <TextInput
            placeholder="Tên"
            placeholderTextColor={'#706d6d'}
            style={{
              fontSize: 16,
              padding: 10,
              backgroundColor: '#eff2ff',
              borderRadius: 8,
              width: '90%',
              color: 'black',
            }}
            onChangeText={setName}
          />
        </Animated.View>
        <Animated.View
          entering={FadeInUp.delay(400).duration(1000).springify()}
          style={{marginTop: 20, alignItems: 'center'}}>
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
            onChangeText={setUsername}
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
          entering={FadeInUp.delay(600).duration(1000).springify()}
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
              placeholder="Nhập lại mật khẩu"
              placeholderTextColor={'#706d6d'}
              style={{
                fontSize: 16,
                color: 'black',
                width: '90%',
              }}
              secureTextEntry={!showConfirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => {
                setShowConfirmPassword(!showConfirmPassword);
              }}>
              <Icon
                name={showConfirmPassword ? 'eye' : 'eye-with-line'}
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
            marginTop: 155,
            alignItems: 'center',
            width: '100%',
          }}>
          <Button
            title="Đăng ký"
            onPress={handleRegister}
            titleStyle={{fontWeight: '700', fontSize: 20}}
            buttonStyle={{
              backgroundColor: Colors.button,
              borderColor: 'transparent',
              borderWidth: 0,
              borderRadius: 30,
              width: 300,
            }}
          />
        </Animated.View>
      </View>
    </View>
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
