import {Avatar, Button} from '@rneui/themed';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Accessory} from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../global/Color';
import EditProfileScreen from './EditProfileScreen';
import {RootState} from '../redux/Store';
import {Route} from '../constants/route';
import UploadPhoto from '../components/ui/UploadPhoto';
import {ZIMKit} from '@zegocloud/zimkit-rn';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {createNotifications} from 'react-native-notificated';
import {disconnectChat} from '../api/ChatApi';
import {disconnectSocket} from '../api/NotificationApi';
import {getFontFamily} from '../utils/fonts';
import {saveUser} from '../redux/UserReducer';
import {updateUser} from '../api/AccountsApi';
import {uploadPhoto} from '../api/UploadPhotoApi';

const {useNotifications} = createNotifications();

const ProfileScreen = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.token.key);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const {notify} = useNotifications();
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
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

  const onUserLogout = async () => {
    await ZIMKit.disconnectUser();
    await ZegoUIKitPrebuiltCallService.uninit();
    return;
  };

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
    onUserLogout();
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
                  description: 'Cập nhật ảnh đại diện thành công.',
                  title: 'Thành công',
                  style: {
                    multiline: 100,
                  },
                },
              });
            } else {
              notify('error', {
                params: {
                  description: 'Cập nhật ảnh đại diện thất bại.',
                  title: 'Lỗi',
                  style: {
                    multiline: 100,
                  },
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
            description: 'Cập nhật ảnh đại diện thất bại.',
            title: 'Lỗi',
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
      />
      <UploadPhoto
        isVisible={isUploadVisible}
        setVisible={setIsUploadVisible}
        isCircle={true}
        postImage={postImage}
        title="Thay đổi ảnh đại diện"
        subtitle="Chọn ảnh từ thư viện hoặc chụp ảnh mới"
      />
      <TouchableOpacity
        onPress={() => navigation.navigate(Route.Support)}
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
        }}>
        <Image
          source={require('../assets/images/support.png')}
          style={{width: 40, height: 40}}
        />
      </TouchableOpacity>

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
          {userInfo.name && (
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
          )}
          {userInfo.birthDate && (
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
          )}
          {userInfo.phone && (
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
          )}
          {userInfo.locationName && (
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
          )}
        </View>
      ) : null}

      {userInfo.role === 'ADMIN' ? (
        <View
          style={{
            marginHorizontal: 35,
            backgroundColor: 'white',
            borderRadius: 8,
            marginVertical: 20,
            overflow: 'hidden',
            padding: 10,
          }}>
          <>
            <Button
              onPress={() => navigation.navigate('Report')}
              title="Quản lý báo cáo"
              buttonStyle={{
                backgroundColor: 'transparent',
                justifyContent: 'flex-start',
              }}
              titleStyle={{color: 'black'}}
              icon={{name: 'report', type: 'material-icon', color: 'black'}}
            />
            <Button
              title="Quản lý tài khoản"
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
            <Button
              title="Quản lý quà tặng"
              buttonStyle={{
                backgroundColor: 'transparent',
                justifyContent: 'flex-start',
              }}
              onPress={() => navigation.navigate('ManageReward')}
              titleStyle={{color: 'black'}}
              icon={{name: 'gift', type: 'ant-design', color: 'black'}}
            />
            <Button
              title="Lịch sử đổi quà"
              buttonStyle={{
                backgroundColor: 'transparent',
                justifyContent: 'flex-start',
              }}
              onPress={() => navigation.navigate('HistoryExchangeGift')}
              titleStyle={{color: 'black'}}
              icon={{name: 'history', type: 'material-icon', color: 'black'}}
            />
          </>
        </View>
      ) : null}
      <View>
        <Button
          title={userInfo.role === 'ADMIN' ? 'Tạo quà tặng' : 'Đổi quà'}
          buttonStyle={{
            backgroundColor: Colors.button,
            alignSelf: 'center',
            borderRadius: 10,
            paddingHorizontal: 100,
          }}
          titleStyle={{color: Colors.white}}
          icon={{name: 'gift', type: 'ant-design', color: 'white'}}
          onPress={() => {
            userInfo.role === 'ADMIN'
              ? navigation.navigate('CreateReward')
              : navigation.navigate('ExchangeGift');
          }}
        />
      </View>
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <Button
          title="Đăng xuất"
          onPress={() => handleLogout()}
          buttonStyle={{
            backgroundColor: Colors.button,
            width: 200,
            alignSelf: 'center',
            borderRadius: 10,
            marginBottom: 50,
          }}
          titleStyle={{fontSize: 16, fontFamily: getFontFamily('bold')}}
        />
      </View>
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
