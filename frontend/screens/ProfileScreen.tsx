import {Avatar, Button} from '@rneui/themed';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {Accessory, Icon} from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../global/Color';
import EditProfileScreen from './EditProfileScreen';
import {resetApp, RootState} from '../redux/Store';
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
import {Text} from 'react-native';
import {scale} from '../utils/scale';
import screenWidth from '../global/Constant';

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
    disconnectSocket();
    disconnectChat();
    dispatch(resetApp());
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
            paddingHorizontal: scale(20),
            backgroundColor: 'white',
            borderRadius: scale(10),
            marginVertical: scale(20),
            overflow: 'hidden',
            padding: scale(10),
            width: '90%',
            alignSelf: 'center',
          }}>
          {userInfo.name && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: scale(10),
              }}>
              <Icon name="user" type="antdesign" color="black" />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: getFontFamily('bold'),
                  color: Colors.black,
                  paddingLeft: scale(10),
                }}>
                {userInfo.name}
              </Text>
            </View>
          )}
          {userInfo.birthDate && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: scale(10),
              }}>
              <Icon name="birthday-cake" type="font-awesome" color="black" />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: getFontFamily('bold'),
                  color: Colors.black,
                  paddingLeft: scale(10),
                }}>
                {new Date(userInfo.birthDate).toLocaleDateString()}
              </Text>
            </View>
          )}
          {userInfo.phone && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: scale(10),
              }}>
              <Icon name="phone" type="font-awesome" color="black" />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: getFontFamily('bold'),
                  color: Colors.black,
                  paddingLeft: scale(10),
                }}>
                {userInfo.phone}
              </Text>
            </View>
          )}
          {userInfo.locationName && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: scale(10),
              }}>
              <Icon name="location" type="entypo" color="black" />
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: getFontFamily('bold'),
                  color: Colors.black,
                  paddingLeft: scale(10),
                }}>
                {userInfo.locationName}
              </Text>
            </View>
          )}
        </View>
      ) : null}

      {userInfo.role === 'ADMIN' ? (
        <View
          style={{
            paddingHorizontal: scale(20),
            backgroundColor: 'white',
            borderRadius: scale(10),
            marginVertical: scale(20),
            overflow: 'hidden',
            padding: scale(10),
            width: '90%',
            alignSelf: 'center',
          }}>
          <>
            <TouchableOpacity
              onPress={() => navigation.navigate('Report')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: scale(10),
              }}>
              <Icon name="report" type="material-icon" color="black" />
              <Text
                style={{
                  paddingLeft: scale(10),
                  fontSize: 16,
                  fontFamily: getFontFamily('bold'),
                  color: Colors.black,
                }}>
                Quản lý báo cáo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Verify')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: scale(10),
              }}>
              <Icon name="verified-user" type="material-icon" color="black" />
              <Text
                style={{
                  paddingLeft: scale(10),
                  fontSize: 16,
                  fontFamily: getFontFamily('bold'),
                  color: Colors.black,
                }}>
                Quản lý tài khoản
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('ManageReward')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: scale(10),
              }}>
              <Icon name="gift" type="ant-design" color="black" />
              <Text
                style={{
                  paddingLeft: scale(10),
                  fontSize: 16,
                  fontFamily: getFontFamily('bold'),
                  color: Colors.black,
                }}>
                Quản lý quà tặng
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('HistoryExchangeGift')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: scale(10),
              }}>
              <Icon name="history" type="material-icon" color="black" />
              <Text
                style={{
                  paddingLeft: scale(10),
                  fontSize: 16,
                  fontFamily: getFontFamily('bold'),
                  color: Colors.black,
                }}>
                Lịch sử đổi quà
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('StatisticScreen')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: scale(10),
              }}>
              <Icon name="bar-chart" type="feather" color="black" />
              <Text
                style={{
                  paddingLeft: scale(10),
                  fontSize: 16,
                  fontFamily: getFontFamily('bold'),
                  color: Colors.black,
                }}>
                Thống kê
              </Text>
            </TouchableOpacity>
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
            width: screenWidth * 0.9,
            marginBottom: 10,
          }}
          titleStyle={{color: Colors.white}}
          icon={{name: 'gift', type: 'ant-design', color: 'white'}}
          onPress={() => {
            userInfo.role === 'ADMIN'
              ? navigation.navigate('CreateReward')
              : navigation.navigate('ExchangeGift');
          }}
        />
        <Button
          title="Thống kê"
          buttonStyle={{
            backgroundColor: Colors.bluePrimary,
            alignSelf: 'center',
            borderRadius: 10,
            width: screenWidth * 0.9,
          }}
          titleStyle={{color: Colors.white}}
          icon={{name: 'bar-chart', type: 'feather', color: 'white'}}
          onPress={() => navigation.navigate('StatisticScreen')}
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
