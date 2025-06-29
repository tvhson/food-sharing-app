import {Image, Text, TouchableWithoutFeedback, View} from 'react-native';
import {acceptInvite, getGroupById, rejectInvite} from '../../api/GroupApi';
import {calculateExpiredDate, timeAgo} from '../../utils/helper';
import {
  createNotification,
  updateNotification,
} from '../../api/NotificationApi';
import {useDispatch, useSelector} from 'react-redux';

import {Button} from '@rneui/themed';
import Colors from '../../global/Color';
import React from 'react';
import {RootState} from '../../redux/Store';
import {Route} from '../../constants/route';
import {confirmReceiveFood} from '../../api/PostApi';
import {updateNotificationAfter} from '../../redux/NotificationReducer';
import {useLoading} from '../../utils/LoadingContext';
import {scale} from '../../utils/scale';

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
  const {showLoading, hideLoading} = useLoading();

  const roomChat = useSelector((state: RootState) =>
    state.chatRoom.chatRooms.find(chatRoom => chatRoom.id === item.linkId),
  );
  const postDetail: any = useSelector((state: RootState) =>
    state.sharingPost.MyPosts.find(post => post.id === item.linkId),
  );

  const handleNavigate = async () => {
    if (item.type === 'MESSAGE') {
      return () => {
        if (!roomChat) {
          return;
        }
        navigation.navigate(Route.ChatRoom, {item: roomChat});
      };
    } else if (item.type === 'GROUP_INVITATION') {
      showLoading();
      const response = await getGroupById(accessToken, item.linkId);
      navigation.navigate(Route.OrganizationPostDetail2, {item: response});
      hideLoading();
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
      createdDate: new Date(),
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

  const handleAcceptGroupRequest = async () => {
    try {
      const notificationUpdate = {
        id: item.id,
        title: 'Chấp nhận',
        imageUrl: item.imageUrl,
        description: 'Bạn đã chấp nhận yêu cầu tham gia nhóm',
        type: 'DONE',
        createdDate: new Date(),
        linkId: item.linkId,
        userId: item.userId,
        senderId: item.senderId,
        read: true,
      };
      const response1: any = await updateNotification(
        item.id,
        accessToken,
        notificationUpdate,
      );
      if (response1.status === 200) {
        dispatch(updateNotificationAfter(notificationUpdate));

        const response2: any = await acceptInvite(
          accessToken,
          item.linkId,
          item.senderId,
        );
      } else {
        console.log(response1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeclineGroupRequest = async () => {
    try {
      const notificationUpdate = {
        id: item.id,
        title: 'Từ chối',
        imageUrl: item.imageUrl,
        description: 'Bạn đã từ chối yêu cầu tham gia nhóm',
        type: 'DONE',
        createdDate: new Date(),
        linkId: item.linkId,
        userId: item.userId,
        senderId: item.senderId,
        read: true,
      };
      const response1: any = await updateNotification(
        item.id,
        accessToken,
        notificationUpdate,
      );
      if (response1.status === 200) {
        dispatch(updateNotificationAfter(notificationUpdate));
        const response2 = await rejectInvite(
          accessToken,
          item.linkId,
          item.senderId,
        );
      } else {
        console.log(response1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAcceptGroupInvitation = async () => {
    try {
      const notificationUpdate = {
        id: item.id,
        title: 'Chấp nhận',
        imageUrl: item.imageUrl,
        description: 'Bạn đã chấp nhận lời mời tham gia nhóm',
        type: 'DONE',
        createdDate: new Date(),
        linkId: item.linkId,
        userId: item.userId,
        senderId: item.senderId,
        read: true,
      };
      const response1: any = await updateNotification(
        item.id,
        accessToken,
        notificationUpdate,
      );
      if (response1.status === 200) {
        dispatch(updateNotificationAfter(notificationUpdate));
      } else {
        console.log(response1);
      }
      const response2 = await acceptInvite(
        accessToken,
        item.linkId,
        item.userId,
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeclineGroupInvitation = async () => {
    try {
      const notificationUpdate = {
        id: item.id,
        title: 'Từ chối',
        imageUrl: item.imageUrl,
        description: 'Bạn đã từ chối lời mời tham gia nhóm',
        type: 'DONE',
        createdDate: item.createdDate,
        linkId: item.linkId,
        userId: item.userId,
        senderId: item.senderId,
        read: true,
      };
      const response1: any = await updateNotification(
        item.id,
        accessToken,
        notificationUpdate,
      );
      if (response1.status === 200) {
        dispatch(updateNotificationAfter(notificationUpdate));
      } else {
        console.log(response1);
      }
      const response2 = await rejectInvite(
        accessToken,
        item.linkId,
        item.userId,
      );
    } catch (error) {
      console.log(error);
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
                justifyContent: 'flex-start',
              }}>
              <Text style={{fontSize: 12, color: Colors.grayText}}>
                {timeAgo(item.createdDate)}
              </Text>
              {item.type === 'RECEIVED' ||
              item.type === 'GROUP_INVITATION' ||
              item.type === 'GROUP_REQUEST' ? (
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginVertical: 3,
                    gap: scale(10),
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
                    onPress={() => {
                      if (item.type === 'RECEIVED') {
                        handleDecline();
                      } else if (item.type === 'GROUP_REQUEST') {
                        handleDeclineGroupRequest();
                      } else {
                        handleAcceptGroupInvitation();
                      }
                    }}
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
                    onPress={() => {
                      if (item.type === 'RECEIVED') {
                        handleAccept();
                      } else if (item.type === 'GROUP_REQUEST') {
                        handleAcceptGroupRequest();
                      } else {
                        handleAcceptGroupInvitation();
                      }
                    }}
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
