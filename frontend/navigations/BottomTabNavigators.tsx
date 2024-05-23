/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';
import {Icon, MD3Colors} from 'react-native-paper';
import NotificationScreen from '../screens/NotificationScreen';
import {FundingScreen} from '../screens/FundingScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({route}: any) => {
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
            <Icon
              source={focused ? 'chat' : 'chat-outline'}
              color="#F6836B"
              size={36}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notification"
        component={NotificationScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Icon
              source={focused ? 'bell' : 'bell-outline'}
              color="#F6836B"
              size={36}
            />
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
