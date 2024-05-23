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
import {pushMyPost, pushSharingPost} from '../redux/SharingPostReducer';
enableScreens();

const LoadingScreen = ({navigation, route}: any) => {
  const token = route.params.token;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setToken(token));
    const saveInfo = async () => {
      try {
        const response: any = await getInfoUser(token);

        if (response.status === 200) {
          const userInfo: UserInfo = response.data;
          dispatch(saveUser(userInfo));
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
    const loadData = async () => {
      try {
        await Promise.all([saveInfo(), saveRecommendPost(), saveMyPost()]);
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
