import {
  ZegoUIKitPrebuiltCallInCallScreen,
  ZegoUIKitPrebuiltCallWaitingScreen,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';

import BottomTabNavigator from './BottomTabNavigators';
import ChatRoomScreen from '../screens/ChatRoomSceen';
import ChatScreen from '../screens/ChatScreen';
import Colors from '../global/Color';
import CreateFundingScreen from '../screens/CreateFundingScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import CreateRewardScreen from '../screens/ManageReward/CreateRewardScreen';
import EditFundingScreen from '../screens/EditFundingScreen';
import EditPostScreen from '../screens/EditPostScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ExchangeGiftScreen from '../screens/ExchangeGiftScreen';
import GroupCreatePostScreen from '../screens/Group/GroupCreatePostScreen';
import GroupEditPostScreen from '../screens/Group/GroupEditPostScreen';
import GroupHomeScreen from '../screens/Group/GroupHomeScreen';
import HistoryExchangeGiftScreen from '../screens/HistoryExchangeGiftScreen';
import LandingScreen from '../screens/LandingScreen';
import ListGroupScreen from '../screens/ListGroupScreen';
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import ManageReward from '../screens/ManageReward/ManageReward';
import MapScreen from '../screens/MapScreen';
import {MessageListPage} from '@zegocloud/zimkit-rn';
import {MyFundingPostScreen} from '../screens/MyFundingPostScreen';
import MyPostScreen from '../screens/MyPostScreen';
import OrganizationPostDetail from '../screens/OrganizationPostDetail';
import OrganizationPostDetail2 from '../screens/OrganizationPostDetail2';
import PersonalPageOfOther from '../screens/PersonalPageOfOther';
import PointRuleScreen from '../screens/PointRuleScreen';
import PostDetail from '../screens/PostDetail';
import PostDetail2 from '../screens/PostDetail2';
import React from 'react';
import RegisterScreen from '../screens/RegisterScreen';
import ReportDetailScreen from '../screens/ReportDetailScreen';
import ReportScreen from '../screens/ReportScreen';
import {Route} from '../constants/route';
import SupportScreen from '../screens/Support/SupportScreen';
import VerifyScreen from '../screens/VerifyScreen';
import WebViewScreen from '../screens/WebViewScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {getFontFamily} from '../utils/fonts';

const Stack = createNativeStackNavigator();

const Router = () => {
  return (
    <>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={Route.Landing} component={LandingScreen} />
        <Stack.Screen name={Route.Register} component={RegisterScreen} />
        <Stack.Screen name={Route.Login} component={LoginScreen} />
        <Stack.Screen
          name={Route.BottomTabNavigator}
          component={BottomTabNavigator}
        />
        <Stack.Screen name={Route.PostDetail} component={PostDetail} />
        <Stack.Screen
          name={Route.OrganizationPostDetail}
          component={OrganizationPostDetail}
        />
        <Stack.Screen name={Route.Loading} component={LoadingScreen} />
        <Stack.Screen
          name={Route.CreatePost}
          component={CreatePostScreen}
          options={{
            headerShown: true,
            headerTitle: 'Tạo bài viết',
            headerStyle: {backgroundColor: Colors.button},
            headerTitleStyle: {
              color: 'white',
              fontFamily: getFontFamily('semibold'),
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name={Route.EditPost}
          component={EditPostScreen}
          options={{
            headerShown: true,
            headerTitle: 'Chỉnh sửa bài viết',
            headerStyle: {backgroundColor: Colors.button},
            headerTitleStyle: {
              color: 'white',
              fontFamily: getFontFamily('semibold'),
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name={Route.EditFundingPost}
          component={EditFundingScreen}
          options={{
            headerShown: true,
            headerTitle: 'Edit Funding Post',
            headerStyle: {backgroundColor: Colors.button},
            headerTitleStyle: {
              color: 'white',
              fontFamily: getFontFamily('semibold'),
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name={Route.CreateFundingPost}
          component={CreateFundingScreen}
          options={{
            headerShown: true,
            headerTitle: 'Tạo bài viết',
            headerStyle: {backgroundColor: Colors.button},
            headerTitleStyle: {
              color: 'white',
              fontFamily: getFontFamily('semibold'),
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen name={Route.Chat} component={ChatScreen} />
        <Stack.Screen name={Route.ChatRoom} component={ChatRoomScreen} />
        <Stack.Screen name={Route.MyPost} component={MyPostScreen} />
        <Stack.Screen
          name={Route.MyFundingPost}
          component={MyFundingPostScreen}
        />
        <Stack.Screen name={Route.Report} component={ReportScreen} />
        <Stack.Screen
          name={Route.ReportDetail}
          component={ReportDetailScreen}
        />
        <Stack.Screen name={Route.Verify} component={VerifyScreen} />
        <Stack.Screen
          name={Route.OrganizationPostDetail2}
          component={OrganizationPostDetail2}
        />
        <Stack.Screen name={Route.PostDetail2} component={PostDetail2} />
        <Stack.Screen
          name={Route.WebView}
          component={WebViewScreen}
          options={{
            headerShown: true,
            headerTitle: 'Xem trên trình duyệt',
            headerStyle: {backgroundColor: Colors.white},
            headerTitleStyle: {
              color: 'black',
              fontFamily: getFontFamily('semibold'),
            },
            headerTintColor: 'black',
          }}
        />
        <Stack.Screen
          name={Route.ExchangeGift}
          component={ExchangeGiftScreen}
        />
        <Stack.Screen
          name={Route.MessageListPage}
          component={MessageListPage}
        />
        <Stack.Screen
          name={Route.HistoryExchangeGift}
          component={HistoryExchangeGiftScreen}
        />
        <Stack.Screen name={Route.PointRule} component={PointRuleScreen} />
        <Stack.Screen
          name={Route.PersonalPageOfOther}
          component={PersonalPageOfOther}
        />
        <Stack.Screen
          name={Route.CreateReward}
          component={CreateRewardScreen}
        />
        <Stack.Screen name={Route.ManageReward} component={ManageReward} />
        <Stack.Screen name={Route.MapView} component={MapScreen} />
        <Stack.Screen
          name={Route.CreateGroup}
          component={CreateGroupScreen}
          options={{
            headerShown: true,
            headerTitle: 'Tạo nhóm',
            headerStyle: {backgroundColor: Colors.button},
            headerTitleStyle: {
              color: 'white',
              fontFamily: getFontFamily('semibold'),
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name={Route.GroupMember}
          component={ListGroupScreen}
          options={{
            headerShown: true,
            headerTitle: 'Danh sách thành viên',
            headerStyle: {backgroundColor: Colors.button},
            headerTitleStyle: {
              color: 'white',
              fontFamily: getFontFamily('semibold'),
            },
            headerTintColor: 'white',
          }}
        />
        <Stack.Screen
          name={Route.GroupHomeScreen}
          component={GroupHomeScreen}
        />

        <Stack.Screen
          name={Route.GroupCreatePost}
          component={GroupCreatePostScreen}
        />
        <Stack.Screen
          name={Route.GroupEditPost}
          component={GroupEditPostScreen}
        />
        <Stack.Screen
          name={Route.ZegoUIKitPrebuiltCallWaitingScreen}
          component={ZegoUIKitPrebuiltCallWaitingScreen}
        />
        <Stack.Screen
          name={Route.ZegoUIKitPrebuiltCallInCallScreen}
          component={ZegoUIKitPrebuiltCallInCallScreen}
        />
        <Stack.Screen name={Route.Support} component={SupportScreen} />
      </Stack.Navigator>
    </>
  );
};

export default Router;
