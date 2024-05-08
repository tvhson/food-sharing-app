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

const Stack = createNativeStackNavigator();

const Router = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      setUser(storedUser);
      setIsLoading(false);
    };
    checkUser();
  }, [isLoading, user]);
  if (isLoading) {
    return <LoadingScreen />;
  }
  console.log(isLoading, user);
  return (
    <>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {user !== null ? (
          <>
            <Stack.Screen
              name="BottomTabNavigator"
              component={BottomTabNavigator}
            />
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="PostDetail" component={PostDetail} />
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
          </>
        ) : (
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
          </>
        )}
      </Stack.Navigator>
    </>
  );
};

export default Router;
