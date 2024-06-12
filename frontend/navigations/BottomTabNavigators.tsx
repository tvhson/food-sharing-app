/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';
import {Badge, Icon, MD3Colors} from 'react-native-paper';
import NotificationScreen from '../screens/NotificationScreen';
import {FundingScreen} from '../screens/FundingScreen';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/Store';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({route}: any) => {
  const numberOfUnread = useSelector(
    (state: RootState) => state.notification.numberOfUnread,
  );
  const numberOfUnreadChat = useSelector(
    (state: RootState) => state.chatRoom.numberOfUnreadMessages,
  );
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false, tabBarShowLabel: false}}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              source={focused ? 'home' : 'home-outline'}
              color="#F6836B"
              size={36}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Funding"
        component={FundingScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              source={focused ? 'account-heart' : 'account-heart-outline'}
              color="#F6836B"
              size={36}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <>
              <Icon
                source={focused ? 'chat' : 'chat-outline'}
                color="#F6836B"
                size={36}
              />
              <Badge
                visible={!focused && numberOfUnreadChat !== 0}
                size={20}
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 15,
                  backgroundColor: 'red',
                }}>
                {numberOfUnreadChat}
              </Badge>
            </>
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <>
              <Icon
                source={focused ? 'bell' : 'bell-outline'}
                color="#F6836B"
                size={36}
              />
              <Badge
                visible={!focused && numberOfUnread !== 0}
                size={20}
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 15,
                  backgroundColor: 'red',
                }}>
                {numberOfUnread}
              </Badge>
            </>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              source={focused ? 'account' : 'account-outline'}
              color="#F6836B"
              size={36}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
