/* eslint-disable react-native/no-inline-styles */
import {Button} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Text, TouchableOpacity} from 'react-native';
import Animated, {FadeInDown, FadeInUp} from 'react-native-reanimated';
import Colors from '../global/Color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {setStatus} from '../redux/LoadingReducer';

const LandingScreen = ({navigation}: any) => {
  const handleRegister = () => {
    navigation.navigate('Register');
  };
  const handleLogin = () => {
    navigation.navigate('Login');
  };
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLogin = async () => {
      dispatch(setStatus(true));
      try {
        await AsyncStorage.getItem('isLogin')
          .then((isLogin: any) => {
            if (isLogin === 'true') {
              AsyncStorage.getItem('token').then((token: any) => {
                navigation.navigate('Loading', {token: token});
              });
            }
          })
          .catch((error: any) => {
            console.log(error);
          })
          .finally(() => {
            dispatch(setStatus(false));
          });
      } catch (error) {
        console.log(error);
      }
    };
    checkLogin();
  }, [dispatch, navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/LandingPageBackground.png')}
        style={styles.background}
      />
      <View
        style={{
          position: 'absolute',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
        <Animated.Text
          entering={FadeInUp.duration(1000).springify()}
          style={styles.title}>
          Happy Food
        </Animated.Text>
        <Animated.Image
          entering={FadeInUp.delay(200).duration(1000).springify()}
          source={require('../assets/images/MealLogo.png')}
          style={{width: 350, height: 350}}
        />
        <Animated.View
          entering={FadeInDown.delay(400).duration(1000).springify()}
          style={{width: 300, marginTop: 150, marginVertical: 10}}>
          <Button
            title="Đăng nhập"
            icon={{
              name: 'user',
              type: 'font-awesome',
              size: 20,
              color: 'white',
            }}
            onPress={handleLogin}
            iconPosition="left"
            iconContainerStyle={{marginRight: 10}}
            titleStyle={{fontWeight: '700'}}
            buttonStyle={{
              backgroundColor: Colors.button,
              borderColor: 'transparent',
              borderWidth: 0,
              borderRadius: 30,
            }}
            titleProps={{style: {fontSize: 20, color: 'white'}}}
          />
        </Animated.View>
        <Animated.View
          entering={FadeInDown.delay(400).duration(1000).springify()}>
          <TouchableOpacity onPress={handleRegister}>
            <Text
              style={{fontSize: 16, color: Colors.button}} // Apply the color dynamically
            >
              hoặc Đăng ký
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 40,
    color: 'black',
  },
  background: {
    width: '100%',
    height: '100%',
  },
});

export default LandingScreen;
