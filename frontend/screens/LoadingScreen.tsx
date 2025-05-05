import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';

import {Image, PermissionsAndroid, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {UserInfo, saveUser} from '../redux/UserReducer';
import {ZEGO_APP_ID, ZEGO_APP_SIGN} from '@env';
import {
  addNotification,
  countNumberOfUnread,
  setNotifications,
} from '../redux/NotificationReducer';
import {
  calculateUnreadMessages,
  pushChatRoom,
  setChatRooms,
} from '../redux/ChatRoomReducer';
import {
  clearFundingPosts,
  clearMyFundingPosts,
  pushFundingPost,
  pushMyFundingPost,
} from '../redux/OrganizationPostReducer';
import {
  clearMyPosts,
  clearSharingPosts,
  pushMyPost,
  pushSharingPost,
} from '../redux/SharingPostReducer';
import {connectChat, disconnectChat, getRoomChats} from '../api/ChatApi';
import {
  connectNotification,
  disconnectSocket,
  getNotifications,
} from '../api/NotificationApi';
import {getAllAccounts, getInfoUser} from '../api/AccountsApi';
import {
  getOrganizationPost,
  getOrganizationPostOfUser,
} from '../api/OrganizationPostApi';
import {getPostOfUser, getPosts} from '../api/PostApi';

import AsyncStorage from '@react-native-async-storage/async-storage';
import BootSplash from 'react-native-bootsplash';
import Colors from '../global/Color';
import GetLocation from 'react-native-get-location';
/* eslint-disable no-labels */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import LottieView from 'lottie-react-native';
import {ZIMKit} from '@zegocloud/zimkit-rn';
import ZegoUIKitPrebuiltCallService from '@zegocloud/zego-uikit-prebuilt-call-rn';
import analytics from '@react-native-firebase/analytics';
import {enableScreens} from 'react-native-screens';
import {getMyPoint} from '../api/LoyaltyApi';
import {getReport} from '../api/ReportApi';
import {setAccounts} from '../redux/AccountsReducer';
import {setLocation} from '../redux/LocationReducer';
import {setReports} from '../redux/ReportReducer';
import {setToken} from '../redux/TokenReducer';
import {useDispatch} from 'react-redux';

enableScreens();

const LoadingScreen = ({navigation, route}: any) => {
  const token = route.params.token;
  const dispatch = useDispatch();
  const [myId, setMyId] = useState(0);

  const onUserLogin = async (userInfo: UserInfo) => {
    ZIMKit.connectUser(
      {
        userID: String(userInfo.id),
        userName: userInfo.name,
      },
      '',
    )
      .then((data: any) => {
        console.log(data);
        ZegoUIKitPrebuiltCallService.init(
          ZEGO_APP_ID,
          ZEGO_APP_SIGN,
          String(userInfo.id),
          userInfo.name,
          [ZIM, ZPNs],
          {
            ringtoneConfig: {
              incomingCallFileName: 'zego_incoming.mp3',
              outgoingCallFileName: 'zego_outgoing.mp3',
            },
            innerText: {
              incomingVideoCallDialogMessage: 'Có cuộc gọi video đến',
              incomingVoiceCallDialogMessage: 'Có cuộc gọi thoại đến',
              incomingCallPageDeclineButton: 'Từ chối',
              incomingCallPageAcceptButton: 'Chấp nhận',
            },
            notifyWhenAppRunningInBackgroundOrQuit: true,
            androidNotificationConfig: {
              channelID: 'ZegoUIKit',
              channelName: 'ZegoUIKit',
            },
            avatarBuilder: () => {
              return (
                <View style={{width: '100%', height: '100%'}}>
                  <Image
                    style={{width: '100%', height: '100%'}}
                    resizeMode="cover"
                    source={{
                      uri: userInfo.imageUrl
                        ? userInfo.imageUrl
                        : 'https://i.imgur.com/2nCt3Sbl.jpg',
                    }}
                  />
                </View>
              );
            },
          },
        ).then(() => {
          ZegoUIKitPrebuiltCallService.requestSystemAlertWindow({
            message:
              'Chúng tôi cần quyền hiển thị cửa sổ trên các ứng dụng khác để hiển thị cuộc gọi đến.',
            allow: 'Đồng ý',
            deny: 'Từ chối',
          });
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
    console.log('ZIMKit.connectUser');
  };

  useEffect(() => {
    dispatch(setToken(token));
    ZIMKit.init(parseInt(ZEGO_APP_ID || '0', 10), ZEGO_APP_SIGN);
    const checkPermissions = async () => {
      try {
        const cameraGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        const audioGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        );
        const locationGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );
        if (!cameraGranted || !audioGranted || !locationGranted) {
          const permissions = [
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            PermissionsAndroid.PERMISSIONS.CAMERA,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ];
          await PermissionsAndroid.requestMultiple(permissions);
        }
      } catch (err: any) {
        console.log(err.toString());
      }
    };

    const getLocation = async () => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 30000,
        rationale: {
          title: 'Location permission',
          message: 'The app needs the permission to request your location.',
          buttonPositive: 'Ok',
        },
      })
        .then(newLocation => {
          dispatch(setLocation(newLocation));
          console.log(newLocation);
        })
        .catch(ex => {
          console.log(ex);
        });
    };
    const saveInfo = async () => {
      const saveNotification = (body: any) => {
        dispatch(addNotification(body));
      };
      const saveChatRoom = (body: any) => {
        dispatch(pushChatRoom(body));
        dispatch(calculateUnreadMessages(myId));
      };
      const saveReport = async () => {
        try {
          const response: any = await getReport(token.toString());
          if (response.status === 200) {
            const data = response.data;
            dispatch(setReports(data));
          } else {
            throw new Error(response);
          }
        } catch (error) {
          console.log(error);
        }
      };
      const saveAllAccounts = async () => {
        try {
          const response: any = await getAllAccounts(token);
          if (response.status === 200) {
            const data = response.data;
            dispatch(setAccounts(data));
          } else {
            throw new Error(response);
          }
        } catch (error) {
          console.log(error);
        }
      };
      const saveAllChatRoom = async () => {
        try {
          const response: any = await getRoomChats(token.toString());
          if (response.status === 200) {
            const data = response.data;
            dispatch(setChatRooms({chatRooms: data, myId}));
          } else {
            throw new Error(response);
          }
        } catch (error) {
          console.log(error);
        }
      };
      try {
        const response: any = await getInfoUser(token);
        if (response.status === 200) {
          if (response.data.bannedDate !== null) {
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
          }
          const userInfo: UserInfo = response.data;
          onUserLogin(userInfo);
          setMyId(userInfo.id);
          dispatch(saveUser(userInfo));
          connectNotification(userInfo.id, saveNotification);
          connectChat(userInfo.id, saveChatRoom);
          saveAllChatRoom();
          if (response.data.role === 'ADMIN') {
            saveReport();
            saveAllAccounts();
          }
        } else {
          console.log(response);
          throw new Error(response);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const saveRecommendPost = async () => {
      try {
        const response: any = await getPosts(token.toString());
        if (response.status === 200) {
          const data = response.data;
          dispatch(clearSharingPosts());
          for (const sharingPost of data) {
            dispatch(pushSharingPost(sharingPost));
          }
        } else {
          console.log(response);
          throw new Error(response);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const saveMyPost = async () => {
      try {
        const response: any = await getPostOfUser(token.toString());
        if (response.status === 200) {
          const data = response.data;
          dispatch(clearMyPosts());
          for (const sharingPost of data) {
            dispatch(pushMyPost(sharingPost));
          }
        } else {
          console.log(response);
          throw new Error(response);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const saveOrganizationPost = async () => {
      try {
        const response: any = await getOrganizationPost(token.toString());
        if (response.status === 200) {
          const data = response.data;
          dispatch(clearFundingPosts());
          for (const fundingPost of data) {
            dispatch(pushFundingPost(fundingPost));
          }
        } else {
          console.log(response);
          throw new Error(response);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const saveMyOrganizationPost = async () => {
      try {
        const response: any = await getOrganizationPostOfUser(token.toString());
        if (response.status === 200) {
          const data = response.data;
          dispatch(clearMyFundingPosts());
          for (const fundingPost of data) {
            dispatch(pushMyFundingPost(fundingPost));
          }
        } else {
          console.log(response);
          throw new Error(response);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const saveNotification = async () => {
      try {
        const response: any = await getNotifications(token.toString());
        if (response.status === 200) {
          const data = response.data;
          dispatch(setNotifications(data));
          dispatch(countNumberOfUnread());
        } else {
          console.log(response);
          throw new Error(response);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const sendData = async () => {
      try {
        await analytics().logEvent('loadData', {
          id: myId,
          status: 'success',
        });
      } catch (error) {
        console.log(error);
      }
    };
    const getPoint = async () => {
      try {
        const response: any = await getMyPoint(token.toString());
        if (response.status === 200) {
        } else {
          throw new Error(response);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const loadData = async () => {
      try {
        await Promise.all([
          getLocation(),
          saveInfo(),
          saveRecommendPost(),
          saveMyPost(),
          saveOrganizationPost(),
          saveMyOrganizationPost(),
          saveNotification(),
          sendData(),
          getPoint(),
        ]);
        setTimeout(
          () =>
            navigation.reset({
              index: 0,
              routes: [{name: 'BottomTabNavigator'}],
            }),
          2000,
        );
        BootSplash.hide();
      } catch (error) {
        console.log(error);
      }
    };

    checkPermissions();
    loadData();
  }, [dispatch, myId, navigation, token]);

  return (
    <View style={{flex: 1, backgroundColor: Colors.background}}>
      <Text style={styles.textLoading}>HappyFood</Text>
      <LottieView
        source={require('../assets/json/loading.json')}
        autoPlay
        loop
        style={{flex: 1}}
      />
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  textLoading: {
    alignSelf: 'center',
    fontSize: 36,
    marginTop: 50,
    color: Colors.postTitle,
    fontWeight: 'bold',
  },
});
