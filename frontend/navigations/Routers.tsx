import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import LandingScreen from '../screens/LandingScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BottomTabNavigator from './BottomTabNavigators';
import PostDetail from '../screens/PostDetail';
import CreatePostScreen from '../screens/CreatePostScreen';
import Colors from '../global/Color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingScreen from '../screens/LoadingScreen';
import {getInfoUser} from '../api/AccountsApi';
import {getPosts} from '../api/PostApi';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/Store';
import AppLoader from '../components/ui/AppLoader';
import EditProfileScreen from '../screens/EditProfileScreen';
import EditPostScreen from '../screens/EditPostScreen';
import CreateFundingScreen from '../screens/CreateFundingScreen';
import OrganizationPostDetail from '../screens/OrganizationPostDetail';
import EditFundingScreen from '../screens/EditFundingScreen';
import ChatRoomScreen from '../screens/ChatRoomSceen';

const Stack = createNativeStackNavigator();

const Router = () => {
  const isLoading = useSelector((state: RootState) => state.loading.status);
  const token = useSelector((state: RootState) => state.token.key);
  const dispatch = useDispatch();

  return (
    <>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <>
          <Stack.Screen name="Landing" component={LandingScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="BottomTabNavigator"
            component={BottomTabNavigator}
          />
          <Stack.Screen name="PostDetail" component={PostDetail} />
          <Stack.Screen
            name="OrganizationPostDetail"
            component={OrganizationPostDetail}
          />
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen
            name="CreatePost"
            component={CreatePostScreen}
            options={{
              headerShown: true,
              headerTitle: 'Create Post',
              headerStyle: {
                backgroundColor: Colors.button,
              },
              headerTitleStyle: {
                color: 'white',
              },
              headerTintColor: 'white',
            }}
          />
          <Stack.Screen
            name="EditPost"
            component={EditPostScreen}
            options={{
              headerShown: true,
              headerTitle: 'Edit Post',
              headerStyle: {
                backgroundColor: Colors.button,
              },
              headerTitleStyle: {
                color: 'white',
              },
              headerTintColor: 'white',
            }}
          />
          <Stack.Screen
            name="EditFundingPost"
            component={EditFundingScreen}
            options={{
              headerShown: true,
              headerTitle: 'Edit Funding Post',
              headerStyle: {
                backgroundColor: Colors.button,
              },
              headerTitleStyle: {
                color: 'white',
              },
              headerTintColor: 'white',
            }}
          />
          <Stack.Screen
            name="CreateFundingPost"
            component={CreateFundingScreen}
            options={{
              headerShown: true,
              headerTitle: 'Create Funding Post',
              headerStyle: {
                backgroundColor: Colors.button,
              },
              headerTitleStyle: {
                color: 'white',
              },
              headerTintColor: 'white',
            }}
          />
          <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
        </>
      </Stack.Navigator>
      <EditProfileScreen />
    </>
  );
};

export default Router;
