/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ChatScreen from '../screens/ChatScreen';
import FundingScreen from '../screens/FundingScreen';
import {Icon} from '@rneui/themed';
import NotificationScreen from '../screens/NotificationScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
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
              name={focused ? 'home' : 'home-outline'}
              color="#F6836B"
              type="material-community"
              size={40}
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
              name={focused ? 'accessibility' : 'accessibility-outline'}
              color="#F6836B"
              type="ionicon"
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
              name={focused ? 'chat' : 'chat-bubble-outline'}
              color="#F6836B"
              type="material"
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
              name={focused ? 'bell-alt' : 'bell'}
              color="#F6836B"
              type="fontisto"
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
              name={focused ? 'user' : 'user-o'}
              color="#F6836B"
              type="font-awesome"
              size={40}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
