/* eslint-disable react-native/no-inline-styles */

import {Accessory} from '@rneui/base';
import {Avatar, Button} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import Colors from '../global/Color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UploadPhoto from '../components/ui/UploadPhoto';
import {uploadPhoto} from '../api/UploadPhotoApi';

import {PermissionsAndroid} from 'react-native';
import EditProfileScreen from './EditProfileScreen';
import {updateUser} from '../api/AccountsApi';
import {createNotifications} from 'react-native-notificated';

const {useNotifications} = createNotifications();

const ProfileScreen = ({navigation}: any) => {
  const {notify} = useNotifications();
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [infoUser, setInfoUser] = useState<any | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        const parsedToken = JSON.parse(storedToken);
        setToken(parsedToken.accessToken);
      }
    };
    const requestCameraPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'This app needs access to your camera',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Camera permission granted');
        } else {
          console.log('Camera permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    };
    const getInfoUser = async () => {
      const getInfo = await AsyncStorage.getItem('infoUser');
      if (getInfo) {
        const parsedInfo = JSON.parse(getInfo);
        setInfoUser(parsedInfo);
        if (parsedInfo.imageUrl) {
          setImageUrl(parsedInfo.imageUrl);
        }
        if (parsedInfo.email) {
          setEmail(parsedInfo.email);
        }
        if (parsedInfo.name) {
          setName(parsedInfo.name);
        }
      }
    };

    getToken();
    requestCameraPermission();
    getInfoUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Landing');
  };

  const postImage = (image: any) => {
    const dataForm = new FormData();
    dataForm.append('file', {
      uri: image.path,
      name: image.filename || 'image.jpeg',
      type: image.mime || 'image/jpeg',
    });
    uploadPhoto(dataForm, token).then((response: any) => {
      if (response.status === 200) {
        console.log(response.data);
        setImageUrl(response.data);
        updateUser({imageUrl: imageUrl[0], email: email, name: name}, token)
          .then((response2: any) => {
            console.log(imageUrl[0], email, name, token);
            console.log(response2);
            if (response2.status === 200) {
              console.log(response2.data);
              AsyncStorage.setItem('infoUser', JSON.stringify(response2.data));
              notify('success', {
                params: {
                  description: 'Update avatar successful.',
                  title: 'Success',
                },
              });
            } else {
              notify('error', {
                params: {
                  description: 'Update avatar failed.',
                  title: 'Error',
                },
              });
            }
          })
          .catch((error: any) => {
            notify('error', {
              params: {
                description: error.message,
                title: 'Error',
                style: {multiline: 100},
              },
            });
          });
        return response.data;
      } else {
        console.log(response.status);
        throw new Error(response.data.errorMessage);
      }
    });
  };

  return (
    <View style={styles.container}>
      <EditProfileScreen
        isVisible={isEditVisible}
        setVisible={setIsEditVisible}
        infoUser={infoUser}
        token={token}
      />
      <UploadPhoto
        isVisible={isUploadVisible}
        setVisible={setIsUploadVisible}
        height={140}
        width={140}
        isCircle={true}
        postImage={postImage}
      />
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
            source={{
              uri:
                imageUrl && imageUrl.length > 0
                  ? imageUrl[0]
                  : 'https://randomuser.me/api/portraits/men/36.jpg',
            }}>
            <Accessory
              size={30}
              name="edit"
              color={'white'}
              style={{backgroundColor: Colors.button}}
              onPress={() => {
                setIsUploadVisible(!isUploadVisible);
              }}
            />
          </Avatar>
        </View>
        <View
          style={{
            marginHorizontal: 40,
            backgroundColor: 'white',
            borderRadius: 8,
            marginVertical: 20,
            overflow: 'hidden',
            padding: 10,
          }}>
          <Button
            title="Edit profile"
            buttonStyle={{
              backgroundColor: 'transparent',
              justifyContent: 'flex-start',
            }}
            titleStyle={{color: 'black'}}
            icon={{name: 'profile', type: 'antdesign', color: 'black'}}
            onPress={() => setIsEditVisible(!isEditVisible)}
          />
          <Button
            title="Notification"
            buttonStyle={{
              backgroundColor: 'transparent',
              justifyContent: 'flex-start',
            }}
            titleStyle={{color: 'black'}}
            icon={{name: 'bell', type: 'entypo', color: 'black'}}
          />
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
