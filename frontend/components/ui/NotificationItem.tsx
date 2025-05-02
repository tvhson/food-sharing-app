import {Image, Text, TouchableWithoutFeedback, View} from 'react-native';
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  calculateDistance,
  calculateExpiredDate,
  timeAgo,
} from '../../utils/helper';
import {confirmReceiveFood, updatePost} from '../../api/PostApi';
import {
  createNotification,
  updateNotification,
} from '../../api/NotificationApi';
import {useDispatch, useSelector} from 'react-redux';

import {Button} from '@rneui/themed';
import Colors from '../../global/Color';
import {RootState} from '../../redux/Store';
import {Route} from '../../constants/route';
import {updateNotificationAfter} from '../../redux/NotificationReducer';

const NotificationItem = ({
  item,
  navigation,
  setVisible,
  setSelectedItem,
}: any) => {
  const accessToken = useSelector((state: RootState) => state.token.key);
  const location = useSelector((state: RootState) => state.location);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const dispatch = useDispatch();

  const roomChat = useSelector((state: RootState) =>
    state.chatRoom.chatRooms.find(chatRoom => chatRoom.id === item.linkId),
  );
  const postDetail: any = useSelector((state: RootState) =>
    state.sharingPost.MyPosts.find(post => post.id === item.linkId),
  );

  const handleNavigate = () => {
    if (item.type === 'MESSAGE') {
      return () => {
        if (!roomChat) {
          return;
        }
        navigation.navigate(Route.ChatRoom, {item: roomChat});
      };
    } else if (item.type === 'RATING') {
      setSelectedItem(item);
      setVisible(true);
    } else {
      return () => {
        if (!postDetail) {
          return;
        }
        navigation.navigate(Route.PostDetail2, {
          item: postDetail,
          location,
          createdDate: timeAgo(postDetail.createdDate),
          expiredString: calculateExpiredDate(new Date(postDetail.expiredDate)),
          distance: calculateDistance(postDetail, location),
        });
      };
    }
  };
  const handleDecline = async () => {
    const notificationUpdate = {
      id: item.id,
      title: 'Từ chối',
      imageUrl: item.imageUrl,
      description: 'Bạn đã từ chối xác nhận việc nhận thức ăn',
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
          title: 'Từ chối xác nhận',
          imageUrl: item.imageUrl,
          description:
            userInfo.name + ' đã từ chối xác nhận việc nhận thức ăn của bạn',
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
    const notificationUpdate = {
      id: item.id,
      title: 'Xác nhận',
      imageUrl: item.imageUrl,
      description: 'Bạn đã xác nhận việc nhận thức ăn',
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
      const response2: any = await confirmReceiveFood(
        item.linkId,
        item.senderId,
        accessToken,
      );

      const response3: any = createNotification(
        {
          title: 'Xác nhận việc nhận thức ăn',
          imageUrl: item.imageUrl,
          description:
            userInfo.name +
            ' đã xác nhận việc nhận thức ăn của bạn. Vui lòng bấm vào thông báo để đánh giá thức ăn',
          type: 'RATING',
          linkId: item.linkId,
          senderId: userInfo.id,
          userId: item.senderId,
        },
        accessToken,
      );
      if (response2.status === 200 && response3.status === 200) {
        console.log('Accept success');
      } else {
        console.log(response3);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleNavigate}>
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
                    title={'Từ chối'}
                    buttonStyle={{
                      backgroundColor: Colors.red,
                      borderColor: 'transparent',
                      borderWidth: 0,
                      borderRadius: 10,
                      paddingHorizontal: 20,
                    }}
                    titleStyle={{fontWeight: '700', fontSize: 12}}
                    onPress={() => handleDecline()}
                  />
                  <Button
                    title={'Chấp nhận'}
                    buttonStyle={{
                      backgroundColor: Colors.greenPrimary,
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
