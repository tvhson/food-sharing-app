/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect, useState} from 'react';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import {Badge, Icon, MD3Colors} from 'react-native-paper';
import NotificationScreen from '../screens/NotificationScreen';
import {FundingScreen} from '../screens/FundingScreen';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/Store';
import {Image, View} from 'react-native';
import Colors from '../global/Color';
import Header from '../components/ui/HeaderHome';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FoodPreferenceScreen from '../screens/FoodPreferenceScreen';
import PersonalPage from '../screens/PersonalPage';
import Conversation from '../screens/TestChat/Conversation';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({route, navigation}: any) => {
  const numberOfUnread = useSelector(
    (state: RootState) => state.notification.numberOfUnread,
  );
  const numberOfUnreadChat = useSelector(
    (state: RootState) => state.chatRoom.numberOfUnreadMessages,
  );

  return (
    <View style={{flex: 1}}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: false,
        }}>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({focused}) => {
              return (
                <Image
                  source={
                    focused
                      ? require('../assets/images/home.png')
                      : require('../assets/images/home-outline.png')
                  }
                  style={{width: 28, height: 28, alignSelf: 'center'}}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="Funding"
          component={FundingScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <Image
                source={
                  focused
                    ? require('../assets/images/organization.png')
                    : require('../assets/images/organization-outline.png')
                }
                style={{width: 28, height: 28, alignSelf: 'center'}}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Conversation"
          component={Conversation}
          options={{
            tabBarIcon: ({focused}) => (
              <>
                <Image
                  source={
                    focused
                      ? require('../assets/images/friend.png')
                      : require('../assets/images/friend-outline.png')
                  }
                  style={{width: 28, height: 28, alignSelf: 'center'}}
                />
              </>
            ),
          }}
        />
        <Tab.Screen
          name="Personal"
          component={PersonalPage}
          options={{
            tabBarIcon: ({focused}) => (
              <>
                <Image
                  source={
                    focused
                      ? require('../assets/images/user.png')
                      : require('../assets/images/user-outline.png')
                  }
                  style={{width: 26, height: 26, alignSelf: 'center'}}
                />
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
                <Image
                  source={
                    focused
                      ? require('../assets/images/notification.png')
                      : require('../assets/images/notification-outline.png')
                  }
                  style={{width: 28, height: 28, alignSelf: 'center'}}
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
              <Image
                source={
                  focused
                    ? require('../assets/images/setting.png')
                    : require('../assets/images/setting-outline.png')
                }
                style={{width: 28, height: 28, alignSelf: 'center'}}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default BottomTabNavigator;
