/* eslint-disable react-native/no-inline-styles */
import LottieView from 'lottie-react-native';
import React, {useEffect, useState} from 'react';

import {View, Text, StyleSheet} from 'react-native';
import Colors from '../global/Color';
import {useDispatch} from 'react-redux';
import {getAllAccounts, getInfoUser} from '../api/AccountsApi';
import {UserInfo, saveUser} from '../redux/UserReducer';
import {setToken} from '../redux/TokenReducer';
import {getPostOfUser, getPosts} from '../api/PostApi';
import {enableScreens} from 'react-native-screens';
import {
  clearMyPosts,
  clearSharingPosts,
  pushMyPost,
  pushSharingPost,
} from '../redux/SharingPostReducer';
import {
  getOrganizationPost,
  getOrganizationPostOfUser,
} from '../api/OrganizationPostApi';
import {
  clearFundingPosts,
  clearMyFundingPosts,
  pushFundingPost,
  pushMyFundingPost,
} from '../redux/OrganizationPostReducer';
import GetLocation from 'react-native-get-location';
import {setLocation} from '../redux/LocationReducer';
import {
  connectNotification,
  disconnectSocket,
  getNotifications,
} from '../api/NotificationApi';
import {
  addNotification,
  countNumberOfUnread,
  setNotifications,
} from '../redux/NotificationReducer';
import {connectChat, disconnectChat, getRoomChats} from '../api/ChatApi';
import {
  calculateUnreadMessages,
  pushChatRoom,
  setChatRooms,
} from '../redux/ChatRoomReducer';
import {getReport} from '../api/ReportApi';
import {setReports} from '../redux/ReportReducer';
import {setAccounts} from '../redux/AccountsReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
enableScreens();

const LoadingScreen = ({navigation, route}: any) => {
  const token = route.params.token;
  const dispatch = useDispatch();
  const [myId, setMyId] = useState(0);

  useEffect(() => {
    dispatch(setToken(token));
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
        console.log(body);
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
            console.log(response);
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
            console.log(response);
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
            console.log(response);
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
        ]);
        setTimeout(
          () =>
            navigation.reset({
              index: 0,
              routes: [{name: 'BottomTabNavigator'}],
            }),
          2000,
        );
      } catch (error) {
        console.log(error);
      }
    };
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
