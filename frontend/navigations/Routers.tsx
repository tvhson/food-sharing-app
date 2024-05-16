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

const Stack = createNativeStackNavigator();

const Router = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        const parsedToken = JSON.parse(storedToken);
        setAccessToken(parsedToken.accessToken);
      }
      setToken(storedToken);
      setIsLoading(false);
    };
    const getUserInfo = async () => {
      getInfoUser(accessToken).then((response: any) => {
        if (response.status === 200) {
          AsyncStorage.setItem('infoUser', JSON.stringify(response.data));
          setUserInfo(response.data);
          setDataLoaded(true);
        }
      });
    };
    checkUser();
    getUserInfo();
  }, [accessToken, isLoading, token]);
  if (isLoading || !dataLoaded) {
    return <LoadingScreen />;
  }
  //console.log(isLoading, user);
  return (
    <>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {token !== null ? (
          <>
            <Stack.Screen
              name="BottomTabNavigator"
              component={BottomTabNavigator}
              initialParams={{accessToken: accessToken, userInfo: userInfo}}
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
