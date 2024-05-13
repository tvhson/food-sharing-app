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
        params: {description: 'Please fill all fields.', title: 'Error'},
      });
      return;
    }
    if (!validateEmail(username)) {
      notify('error', {
        params: {description: 'Invalid email.', title: 'Error'},
      });
      return;
    }

    if (!validatePassword(password)) {
      notify('error', {
        params: {
          description:
            'Password must contain at least 8 characters, including letters and numbers.',
          title: 'Error',
          style: {multiline: 100},
        },
      });
      return;
    }
    if (!validateConfirmPassword(password, confirmPassword)) {
      notify('error', {
        params: {description: 'Password does not match.', title: 'Error'},
      });
      return;
    }
    const email: string = username;
    register({name, email, password})
      .then(response => {
        if (response.status === 200) {
          notify('success', {
            params: {
              description: 'Register success',
              title: 'Success',
            },
          });
          navigation.navigate('Login');
        } else {
          console.log(response.data.message || 'Register failed.');
          notify('error', {
            params: {
              description: response.data.message || 'Register failed.',
              title: 'Error',
            },
          });
        }
      })
      .catch(error => {
        notify('error', {
          params: {
            description: error.message,
            title: 'Error',
            style: {multiline: 100},
          },
        });
      });
  };
  const handleLogin = () => {
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
            Create new{'\n  '} Account
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
              Already Registered? Login
            </Text>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          entering={FadeInUp.delay(400).duration(1000).springify()}
          style={{marginTop: 130, alignItems: 'center'}}>
          <TextInput
            placeholder="Name"
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
              placeholder="Password"
              placeholderTextColor={'#706d6d'}
              style={{
                fontSize: 16,
                color: 'black',
                width: '90%',
              }}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
            />
            <TouchableWithoutFeedback>
              <Icon
                name={showPassword ? 'eye' : 'eye-with-line'}
                type="entypo"
                size={24}
                color={'#706d6d'}
                onPress={() => {
                  setShowPassword(!showPassword);
                }}
              />
            </TouchableWithoutFeedback>
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
              placeholder="Confirm password"
              placeholderTextColor={'#706d6d'}
              style={{
                fontSize: 16,
                color: 'black',
                width: '90%',
              }}
              secureTextEntry={!showConfirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableWithoutFeedback>
              <Icon
                name={showConfirmPassword ? 'eye' : 'eye-with-line'}
                type="entypo"
                size={24}
                color={'#706d6d'}
                onPress={() => {
                  setShowConfirmPassword(!showConfirmPassword);
                }}
              />
            </TouchableWithoutFeedback>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(400).duration(1000).springify()}
          style={{
            marginTop: 120,
            alignItems: 'center',
            width: '100%',
          }}>
          <Button
            title="Register"
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
