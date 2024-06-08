/* eslint-disable react-native/no-inline-styles */

import {Accessory} from '@rneui/base';
import {Avatar, Button} from '@rneui/themed';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ImageBackground, ScrollView} from 'react-native';
import Colors from '../global/Color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UploadPhoto from '../components/ui/UploadPhoto';
import {uploadPhoto} from '../api/UploadPhotoApi';

import EditProfileScreen from './EditProfileScreen';
import {createNotifications} from 'react-native-notificated';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/Store';
import {saveUser} from '../redux/UserReducer';
import {disconnectSocket} from '../api/NotificationApi';
import {disconnectChat} from '../api/ChatApi';
import {updateUser} from '../api/AccountsApi';

const {useNotifications} = createNotifications();

const ProfileScreen = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.token.key);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const {notify} = useNotifications();
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  console.log(userInfo);
  useEffect(() => {
    const getImageUrl = async () => {
      if (userInfo.imageUrl) {
        setImageUrl(userInfo.imageUrl);
      }
    };

    if (userInfo) {
      getImageUrl();
    }
  }, [accessToken, isEditVisible, userInfo]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('isLogin');
    await AsyncStorage.removeItem('userInfo');
    await AsyncStorage.removeItem('recommendPost');
    disconnectSocket();
    disconnectChat();
    navigation.reset({
      index: 0,
      routes: [{name: 'Landing'}],
    });
  };

  const postImage = (image: any) => {
    const dataForm = new FormData();
    dataForm.append('file', {
      uri: image.path,
      name: image.filename || 'image.jpeg',
      type: image.mime || 'image/jpeg',
    });
    uploadPhoto(dataForm, accessToken).then((response: any) => {
      if (response.status === 200) {
        const imageUrlString = response.data[0];
        setImageUrl(imageUrlString);
        updateUser(
          {
            imageUrl: response.data[0],
            email: userInfo.email,
            name: userInfo.name,
            bannedDate: userInfo.bannedDate,
            birthDate: userInfo.birthDate,
            description: userInfo.description,
            phone: userInfo.phone,
            status: userInfo.status,
            latitude: userInfo.latitude,
            longitude: userInfo.longitude,
            locationName: userInfo.locationName,
          },
          accessToken,
        )
          .then((response2: any) => {
            //console.log(response2);
            if (response2.status === 200) {
              AsyncStorage.setItem('userInfo', JSON.stringify(response2.data));
              const userInfo2: any = response2.data;
              dispatch(saveUser(userInfo2));
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
        notify('error', {
          params: {
            description: 'Upload image failed.',
            title: 'Error',
          },
        });
      }
    });
  };
  return (
    <View style={styles.container}>
      <EditProfileScreen
        isVisible={isEditVisible}
        setVisible={setIsEditVisible}
        userInfo={userInfo}
        token={accessToken}
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
              uri: imageUrl
                ? imageUrl
                : 'https://randomuser.me/api/portraits/men/36.jpg',
            }}>
            <Accessory
              size={30}
              name="edit"
              color={'white'}
              style={{backgroundColor: Colors.button, overflow: 'hidden'}}
              onPress={() => {
                setIsUploadVisible(!isUploadVisible);
              }}
            />
          </Avatar>
        </View>
        {userInfo.role !== 'ADMIN' ? (
          <View
            style={{
              marginHorizontal: 35,
              backgroundColor: 'white',
              borderRadius: 8,
              marginVertical: 20,
              overflow: 'hidden',
              padding: 10,
            }}>
            <Button
              title={userInfo.name}
              disabled
              disabledStyle={{backgroundColor: 'transparent'}}
              disabledTitleStyle={{color: 'black'}}
              buttonStyle={{
                backgroundColor: 'transparent',
                justifyContent: 'flex-start',
              }}
              titleStyle={{color: 'black', marginLeft: 10}}
              icon={{name: 'user', type: 'antdesign', color: 'black'}}
            />
            <Button
              disabled
              disabledStyle={{backgroundColor: 'transparent'}}
              disabledTitleStyle={{color: 'black'}}
              title={new Date(userInfo.birthDate).toLocaleDateString()}
              buttonStyle={{
                backgroundColor: 'transparent',
                justifyContent: 'flex-start',
              }}
              titleStyle={{color: 'black', marginLeft: 10}}
              icon={{
                name: 'birthday-cake',
                type: 'font-awesome',
                color: 'black',
              }}
            />
            <Button
              disabled
              disabledStyle={{backgroundColor: 'transparent'}}
              disabledTitleStyle={{color: 'black'}}
              title={userInfo.phone}
              buttonStyle={{
                backgroundColor: 'transparent',
                justifyContent: 'flex-start',
              }}
              titleStyle={{color: 'black', marginLeft: 10}}
              icon={{name: 'phone', type: 'font-awesome', color: 'black'}}
            />
            <Button
              disabled
              disabledStyle={{backgroundColor: 'transparent'}}
              disabledTitleStyle={{color: 'black'}}
              title={userInfo.locationName}
              buttonStyle={{
                backgroundColor: 'transparent',
                justifyContent: 'flex-start',
              }}
              titleStyle={{color: 'black'}}
              icon={{name: 'location', type: 'entypo', color: 'black'}}
            />
          </View>
        ) : null}

        <View
          style={{
            marginHorizontal: 35,
            backgroundColor: 'white',
            borderRadius: 8,
            marginVertical: 20,
            overflow: 'hidden',
            padding: 10,
          }}>
          {userInfo.role !== 'ADMIN' ? (
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
          ) : null}
          {userInfo.role !== 'ADMIN' ? (
            <Button
              title="My posts"
              buttonStyle={{
                backgroundColor: 'transparent',
                justifyContent: 'flex-start',
              }}
              titleStyle={{color: 'black'}}
              icon={{
                name: 'post-outline',
                type: 'material-community',
                color: 'black',
              }}
              onPress={() => navigation.navigate('MyPost')}
            />
          ) : null}
          {userInfo.role === 'ORGANIZATION' ? (
            <Button
              title="My organization posts"
              buttonStyle={{
                backgroundColor: 'transparent',
                justifyContent: 'flex-start',
              }}
              titleStyle={{color: 'black'}}
              onPress={() => navigation.navigate('MyFundingPost')}
              icon={{name: 'organization', type: 'octicon', color: 'black'}}
            />
          ) : null}
          {userInfo.role === 'ADMIN' ? (
            <>
              <Button
                onPress={() => navigation.navigate('Report')}
                title="Reports"
                buttonStyle={{
                  backgroundColor: 'transparent',
                  justifyContent: 'flex-start',
                }}
                titleStyle={{color: 'black'}}
                icon={{name: 'report', type: 'material-icon', color: 'black'}}
              />
              <Button
                title="Manage Accounts"
                buttonStyle={{
                  backgroundColor: 'transparent',
                  justifyContent: 'flex-start',
                }}
                onPress={() => navigation.navigate('Verify')}
                titleStyle={{color: 'black'}}
                icon={{
                  name: 'verified-user',
                  type: 'material-icon',
                  color: 'black',
                }}
              />
            </>
          ) : null}
        </View>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Button
            title="Logout"
            onPress={() => handleLogout()}
            buttonStyle={{
              backgroundColor: Colors.button,
              width: 200,
              alignSelf: 'center',
              borderRadius: 10,
              marginBottom: 50,
            }}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default ProfileScreen;
