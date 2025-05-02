import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import Colors from '../../global/Color';
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {RootState} from '../../redux/Store';
import {Route} from '../../constants/route';
import {getFontFamily} from '../../utils/fonts';
import {useSelector} from 'react-redux';

const ChatRoomItem = ({item, navigation}: any) => {
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const recipientProfilePic =
    item.recipientProfilePic === null
      ? 'https://randomuser.me/api/portraits/men/36.jpg'
      : item.recipientProfilePic;
  const senderProfilePic =
    item.senderProfilePic === null
      ? 'https://randomuser.me/api/portraits/men/36.jpg'
      : item.senderProfilePic;
  function timeAgo(dateInput: Date | string | number) {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      throw new Error('date must be a valid Date, string, or number');
    }
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      if (diffInSeconds < 0) {
        return 'Vừa xong';
      }
      return `${diffInSeconds} giây trước`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    }

    if (diffInDays < 30) {
      const diffInWeeks = Math.floor(diffInDays / 7);
      return `${diffInWeeks} tuần trước`;
    }

    if (diffInDays < 365) {
      const diffInMonths = Math.floor(diffInDays / 30);
      return `${diffInMonths} tháng trước`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} năm trước`;
  }
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate(Route.ChatRoom, {item});
      }}>
      <View
        style={{
          padding: 10,
          marginVertical: 4,
          backgroundColor: 'white',
          borderRadius: 8,
          flexDirection: 'row',
          elevation: 2,
        }}>
        <Image
          source={{
            uri:
              item.senderId === userInfo.id
                ? recipientProfilePic
                : senderProfilePic,
          }}
          style={{width: 100, height: 100, borderRadius: 8}}
        />
        <View style={{flex: 1, flexDirection: 'column', marginLeft: 8}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontFamily: getFontFamily('regular'),
                fontSize: 22,
                fontWeight:
                  (item.senderId === userInfo.id &&
                    item.senderStatus === 'UNREAD') ||
                  (item.recipientId === userInfo.id &&
                    item.recipientStatus === 'UNREAD')
                    ? 'bold'
                    : 'normal',
                color: Colors.postTitle,
              }}>
              {item.senderId === userInfo.id
                ? item.recipientName
                : item.senderName}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontFamily: getFontFamily('regular'),
                fontSize: 16,
                color:
                  (item.senderId === userInfo.id &&
                    item.senderStatus === 'UNREAD') ||
                  (item.recipientId === userInfo.id &&
                    item.recipientStatus === 'UNREAD')
                    ? 'black'
                    : Colors.grayText,
                fontWeight:
                  (item.senderId === userInfo.id &&
                    item.senderStatus === 'UNREAD') ||
                  (item.recipientId === userInfo.id &&
                    item.recipientStatus === 'UNREAD')
                    ? 'bold'
                    : 'normal',
              }}>
              {item.lastMessageSenderId === userInfo.id ? 'Bạn: ' : ''}
              {item.lastMessage}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
          <Text
            style={{
              fontFamily: getFontFamily('regular'),
              fontSize: 12,
              color:
                (item.senderId === userInfo.id &&
                  item.senderStatus === 'UNREAD') ||
                (item.recipientId === userInfo.id &&
                  item.recipientStatus === 'UNREAD')
                  ? 'black'
                  : Colors.grayText,
              fontWeight:
                (item.senderId === userInfo.id &&
                  item.senderStatus === 'UNREAD') ||
                (item.recipientId === userInfo.id &&
                  item.recipientStatus === 'UNREAD')
                  ? 'bold'
                  : 'normal',
            }}>
            {timeAgo(item.lastMessageCreatedDate)}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ChatRoomItem;
