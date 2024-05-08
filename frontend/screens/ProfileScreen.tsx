/* eslint-disable react-native/no-inline-styles */

import {Accessory} from '@rneui/base';
import {Avatar, Button} from '@rneui/themed';
import React from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import Colors from '../global/Color';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({navigation}: any) => {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    navigation.replace('Landing');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/ProfileBackground.png')}
        resizeMode="cover"
        style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            width: '100%',
            alignItems: 'center',
            marginTop: 70,
          }}>
          <Avatar
            size={128}
            rounded
            source={{uri: 'https://randomuser.me/api/portraits/men/36.jpg'}}>
            <Accessory
              size={30}
              name="edit"
              color={'white'}
              style={{backgroundColor: Colors.button}}
              onPress={() => {}}
            />
          </Avatar>
        </View>
        <Button
          title="Logout"
          onPress={() => handleLogout()}
          buttonStyle={{
            backgroundColor: Colors.button,
            width: 200,
            alignSelf: 'center',
            marginTop: 20,
            borderRadius: 10,
          }}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default ProfileScreen;
