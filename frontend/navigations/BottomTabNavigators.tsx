import {Image, View} from 'react-native';

import {Badge} from 'react-native-paper';
import {FundingScreen} from '../screens/FundingScreen';
import HomeScreen from '../screens/HomeScreen';
import NotificationScreen from '../screens/NotificationScreen';
import PersonalPage from '../screens/PersonalPage';
import ProfileScreen from '../screens/ProfileScreen';
import React from 'react';
import {RootState} from '../redux/Store';
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFontFamily} from '../utils/fonts';
import {useSelector} from 'react-redux';
import EventListScreen from '../screens/Events/EventListScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({route, navigation}: any) => {
  const numberOfUnread = useSelector(
    (state: RootState) => state.notification.numberOfUnread,
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
          name="Events"
          component={EventListScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <Image
                source={
                  focused
                    ? require('../assets/images/clarity_event-solid.png')
                    : require('../assets/images/clarity_event-line.png')
                }
                style={{width: 28, height: 28, alignSelf: 'center'}}
              />
            ),
          }}
        />
        {/* <Tab.Screen
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
        /> */}
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
                    top: 3,
                    right: 18,
                    backgroundColor: 'red',
                    fontFamily: getFontFamily('bold'),
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
