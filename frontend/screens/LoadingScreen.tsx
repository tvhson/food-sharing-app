/* eslint-disable react-native/no-inline-styles */
import LottieView from 'lottie-react-native';
import React, {useEffect, useState} from 'react';

import {View, Text, StyleSheet} from 'react-native';
import Colors from '../global/Color';
import {useDispatch, useSelector} from 'react-redux';
import {getInfoUser} from '../api/AccountsApi';
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
import {connectNotification, getNotifications} from '../api/NotificationApi';
import {
  addNotification,
  countNumberOfUnread,
  setNotifications,
} from '../redux/NotificationReducer';
import {connectChat, getRoomChats} from '../api/ChatApi';
import {pushChatRoom, setChatRooms} from '../redux/ChatRoomReducer';
enableScreens();

const LoadingScreen = ({navigation, route}: any) => {
  const token = route.params.token;
  const dispatch = useDispatch();

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
        console.log(body, 'Toi o loading');
        dispatch(pushChatRoom(body));
      };
      try {
        const response: any = await getInfoUser(token);
        if (response.status === 200) {
          const userInfo: UserInfo = response.data;
          dispatch(saveUser(userInfo));
          connectNotification(userInfo.id, saveNotification);
          connectChat(userInfo.id, saveChatRoom);
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
    const saveChatRoom = async () => {
      try {
        const response: any = await getRoomChats(token.toString());
        if (response.status === 200) {
          const data = response.data;
          dispatch(setChatRooms(data));
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
        console.log('loading');
        await Promise.all([
          getLocation(),
          saveInfo(),
          saveRecommendPost(),
          saveMyPost(),
          saveOrganizationPost(),
          saveMyOrganizationPost(),
          saveNotification(),
          saveChatRoom(),
        ]);

        console.log('done');
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
  }, [dispatch, navigation, token]);

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
