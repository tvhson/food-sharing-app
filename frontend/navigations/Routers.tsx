import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import LandingScreen from '../screens/LandingScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BottomTabNavigator from './BottomTabNavigators';
import PostDetail from '../screens/PostDetail';
import CreatePostScreen from '../screens/CreatePostScreen';
import Colors from '../global/Color';
import LoadingScreen from '../screens/LoadingScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import EditPostScreen from '../screens/EditPostScreen';
import CreateFundingScreen from '../screens/CreateFundingScreen';
import OrganizationPostDetail from '../screens/OrganizationPostDetail';
import EditFundingScreen from '../screens/EditFundingScreen';
import ChatRoomScreen from '../screens/ChatRoomSceen';
import MyPostScreen from '../screens/MyPostScreen';
import {MyFundingPostScreen} from '../screens/MyFundingPostScreen';
import ReportScreen from '../screens/ReportScreen';
import ReportDetailScreen from '../screens/ReportDetailScreen';
import VerifyScreen from '../screens/VerifyScreen';
import ChatScreen from '../screens/ChatScreen';
import {
  ZegoUIKitPrebuiltCallWaitingScreen,
  ZegoUIKitPrebuiltCallInCallScreen,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {MessageListPage} from '@zegocloud/zimkit-rn';
import OrganizationPostDetail2 from '../screens/OrganizationPostDetail2';
import WebViewScreen from '../screens/WebViewScreen';
import PostDetail2 from '../screens/PostDetail2';
import {getFontFamily} from '../utils/fonts';
import ExchangeGiftScreen from '../screens/ExchangeGiftScreen';
import HistoryExchangeGiftScreen from '../screens/HistoryExchangeGiftScreen';
import PointRuleScreen from '../screens/PointRuleScreen';
import PersonalPageOfOther from '../screens/PersonalPageOfOther';
import CreateRewardScreen from '../screens/ManageReward/CreateRewardScreen';
import ManageReward from '../screens/ManageReward/ManageReward';

const Stack = createNativeStackNavigator();

const Router = () => {
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
              headerTitle: 'Tạo bài viết',
              headerStyle: {
                backgroundColor: Colors.button,
              },
              headerTitleStyle: {
                color: 'white',

                fontFamily: getFontFamily('semibold'),
              },
              headerTintColor: 'white',
            }}
          />
          <Stack.Screen
            name="EditPost"
            component={EditPostScreen}
            options={{
              headerShown: true,
              headerTitle: 'Chỉnh sửa bài viết',
              headerStyle: {
                backgroundColor: Colors.button,
              },
              headerTitleStyle: {
                color: 'white',
                fontFamily: getFontFamily('semibold'),
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
                fontFamily: getFontFamily('semibold'),
              },
              headerTintColor: 'white',
            }}
          />
          <Stack.Screen
            name="CreateFundingPost"
            component={CreateFundingScreen}
            options={{
              headerShown: true,
              headerTitle: 'Tạo chiến dịch',
              headerStyle: {
                backgroundColor: Colors.button,
              },
              headerTitleStyle: {
                color: 'white',
                fontFamily: getFontFamily('semibold'),
              },
              headerTintColor: 'white',
            }}
          />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
          <Stack.Screen name="MyPost" component={MyPostScreen} />
          <Stack.Screen name="MyFundingPost" component={MyFundingPostScreen} />
          <Stack.Screen name="Report" component={ReportScreen} />
          <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
          <Stack.Screen name="Verify" component={VerifyScreen} />
          <Stack.Screen
            name="OrganizationPostDetail2"
            component={OrganizationPostDetail2}
          />
          <Stack.Screen name="PostDetail2" component={PostDetail2} />
          <Stack.Screen
            name="WebView"
            component={WebViewScreen}
            options={{
              headerShown: true,
              headerTitle: 'Xem trên trình duyệt',
              headerStyle: {
                backgroundColor: Colors.white,
              },
              headerTitleStyle: {
                color: 'black',
                fontFamily: getFontFamily('semibold'),
              },
              headerTintColor: 'black',
            }}
          />
          <Stack.Screen name="ExchangeGift" component={ExchangeGiftScreen} />
          <Stack.Screen name="MessageListPage" component={MessageListPage} />
          <Stack.Screen
            name="HistoryExchangeGift"
            component={HistoryExchangeGiftScreen}
          />
          <Stack.Screen name="PointRule" component={PointRuleScreen} />
          <Stack.Screen
            name="PersonalPageOfOther"
            component={PersonalPageOfOther}
          />
          <Stack.Screen name="CreateReward" component={CreateRewardScreen} />
          <Stack.Screen name="ManageReward" component={ManageReward} />
          <Stack.Screen
            options={{headerShown: false}}
            name="ZegoUIKitPrebuiltCallWaitingScreen"
            component={ZegoUIKitPrebuiltCallWaitingScreen}
          />
          <Stack.Screen
            options={{headerShown: false}}
            name="ZegoUIKitPrebuiltCallInCallScreen"
            component={ZegoUIKitPrebuiltCallInCallScreen}
          />
        </>
      </Stack.Navigator>
      <EditProfileScreen />
    </>
  );
};

export default Router;
