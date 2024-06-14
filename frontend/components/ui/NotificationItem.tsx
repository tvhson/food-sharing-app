/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Image, Text, TouchableWithoutFeedback} from 'react-native';
import Colors from '../../global/Color';
import {Button} from '@rneui/themed';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/Store';
import {
  createNotification,
  updateNotification,
} from '../../api/NotificationApi';
import {updateNotificationAfter} from '../../redux/NotificationReducer';
import {updatePost} from '../../api/PostApi';

const NotificationItem = ({item, navigation}: any) => {
  const accessToken = useSelector((state: RootState) => state.token.key);
  const location = useSelector((state: RootState) => state.location);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const dispatch = useDispatch();
  function timeAgo(dateInput: Date | string | number) {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      throw new Error('date must be a valid Date, string, or number');
    }
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 0) {
      return 'Just now';
    }

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    }

    if (diffInDays < 30) {
      const diffInWeeks = Math.floor(diffInDays / 7);
      return `${diffInWeeks} weeks ago`;
    }

    if (diffInDays < 365) {
      const diffInMonths = Math.floor(diffInDays / 30);
      return `${diffInMonths} months ago`;
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} years ago`;
  }
  const roomChat = useSelector((state: RootState) =>
    state.chatRoom.chatRooms.find(chatRoom => chatRoom.id === item.linkId),
  );
  const postDetail: any = useSelector((state: RootState) =>
    state.sharingPost.MyPosts.find(post => post.id === item.linkId),
  );

  const handleNavigate = () => {
    if (item.type === 'MESSAGE') {
      return () => {
        console.log('roomChat', roomChat);
        navigation.navigate('ChatRoom', {item: roomChat});
      };
    } else {
      return () => {
        navigation.navigate('PostDetail', {item: postDetail, location});
      };
    }
  };
  const handleDecline = async () => {
    const notificationUpdate = {
      id: item.id,
      title: 'Decline',
      imageUrl: item.imageUrl,
      description: 'You have declined the confirmation of giving',
      type: 'DONE',
      createdDate: item.createdDate,
      linkId: item.linkId,
      userId: item.userId,
      senderId: item.senderId,
      read: true,
    };
    const response: any = await updateNotification(
      item.id,
      accessToken,
      notificationUpdate,
    );
    if (response.status === 200) {
      dispatch(updateNotificationAfter(notificationUpdate));
      const response2: any = createNotification(
        {
          title: 'Confirmation declined',
          imageUrl: item.imageUrl,
          description:
            userInfo.name + ' has declined your confirmation to receive food',
          type: 'DONE',
          linkId: item.linkId,
          senderId: userInfo.id,
          userId: item.senderId,
        },
        accessToken,
      );
      if (response2.status === 200) {
        console.log('Decline success');
      } else {
        console.log(response2);
      }
    }
  };
  const handleAccept = async () => {
    console.log('Accept');
    const notificationUpdate = {
      id: item.id,
      title: 'Accept',
      imageUrl: item.imageUrl,
      description: 'You have accept the confirmation of giving',
      type: 'DONE',
      createdDate: item.createdDate,
      linkId: item.linkId,
      userId: item.userId,
      senderId: item.senderId,
      read: true,
    };
    const response: any = await updateNotification(
      item.id,
      accessToken,
      notificationUpdate,
    );
    console.log(response);
    if (response.status === 200) {
      console.log('Accept success');
      dispatch(updateNotificationAfter(notificationUpdate));
      const response2: any = await updatePost(
        item.linkId,
        {
          id: postDetail.id,
          title: postDetail.title,
          description: postDetail.description,
          imageUrl: postDetail.imageUrl,
          note: postDetail.note,
          expiredDate: postDetail.expiredDate,
          pickUpStartDate: postDetail.pickUpStartDate,
          pickUpEndDate: postDetail.pickUpEndDate,
          status: 'RECEIVED',
          locationName: postDetail.locationName,
          latitude: postDetail.latitude,
          longitude: postDetail.longitude,
          receiverId: item.senderId,
        },
        accessToken,
      );
      const response3: any = createNotification(
        {
          title: 'Confirmation accepted',
          imageUrl: item.imageUrl,
          description:
            userInfo.name + ' has accepted your confirmation to receive food',
          type: 'DONE',
          linkId: item.linkId,
          senderId: userInfo.id,
          userId: item.senderId,
        },
        accessToken,
      );
      if (response2.status === 200 && response3.status === 200) {
        console.log('Accept success');
      } else {
        console.log(response2);
        console.log(response3);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleNavigate()}>
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
            uri: item.imageUrl
              ? item.imageUrl
              : 'https://www.w3schools.com/w3images/avatar2.png',
          }}
          style={{width: 100, height: 100, borderRadius: 8}}
        />
        <View style={{flex: 1, flexDirection: 'column', marginLeft: 8}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: 'bold',
                color: Colors.postTitle,
              }}>
              {item.title}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <Text style={{fontSize: 16, color: Colors.grayText}}>
              {item.description}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{fontSize: 12, color: Colors.grayText}}>
                {timeAgo(item.createdDate)}
              </Text>
              {item.type === 'RECEIVED' ? (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginVertical: 3,
                  }}>
                  <Button
                    title={'Decline'}
                    buttonStyle={{
                      backgroundColor: Colors.postTitle,
                      borderColor: 'transparent',
                      borderWidth: 0,
                      borderRadius: 10,
                      paddingHorizontal: 20,
                    }}
                    titleStyle={{fontWeight: '700', fontSize: 12}}
                    onPress={() => handleDecline()}
                  />
                  <Button
                    title={'Accept'}
                    buttonStyle={{
                      backgroundColor: Colors.green2,
                      borderColor: 'transparent',
                      borderWidth: 0,
                      borderRadius: 10,
                      paddingHorizontal: 20,
                    }}
                    titleStyle={{fontWeight: '700', fontSize: 12}}
                    onPress={() => handleAccept()}
                  />
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NotificationItem;
