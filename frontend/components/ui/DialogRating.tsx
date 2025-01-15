/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {Image, Rating} from '@rneui/themed';
import {Text, TouchableOpacity, View} from 'react-native';
import {Button, Dialog, IconButton, Portal} from 'react-native-paper';
import {getFontFamily} from '../../utils/fonts';
import Colors from '../../global/Color';
import {earnPoint} from '../../api/LoyaltyApi';
import {RootState} from '../../redux/Store';
import {useDispatch, useSelector} from 'react-redux';
import {
  createNotification,
  updateNotification,
} from '../../api/NotificationApi';
import {updateNotificationAfter} from '../../redux/NotificationReducer';

const DialogRating = (props: {
  visible: boolean;
  setVisible: (value: boolean) => void;
  item: any;
}) => {
  const {visible, setVisible, item} = props;
  const accessToken = useSelector((state: RootState) => state.token.key);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const dispatch = useDispatch();

  const [rating, setRating] = useState(5);
  if (!item) {
    return null;
  }

  const getName = (str: string) => {
    const nameMatch = str.match(/^(.*?)\s+đã/);

    return nameMatch ? nameMatch[1].trim() : null;
  };
  const handleSubmitRating = async () => {
    const response1: any = await earnPoint(
      {accountId: item.senderId, point: rating * 5},
      accessToken,
    );
    const response2: any = await earnPoint(
      {accountId: item.userId, point: 5},
      accessToken,
    );

    if (response1.status === 200 && response2.status === 200) {
      const updatedNoti = {
        ...item,
        title: 'Cảm ơn bạn đã đánh giá',
        description: 'Bạn đã thành công đánh giá món ăn của người khác',
        type: 'DONE',
        imageUrl: item.imageUrl,
        read: true,
      };
      const response: any = await updateNotification(
        item.id,
        accessToken,
        updatedNoti,
      );
      if (response.status === 200) {
        dispatch(updateNotificationAfter(updatedNoti));
        const response3: any = await createNotification(
          {
            title: 'Đánh giá thực phẩm',
            description: `Bạn đã nhận được ${rating} sao từ ${userInfo?.name}`,
            type: 'DONE',
            linkId: item.linkId,
            senderId: item.userId,
            userId: item.senderId,
            imageUrl: item.imageUrl,
          },
          accessToken,
        );
        if (response3.status === 200) {
          console.log('Rating success');
        } else {
          console.log(response3);
        }
      }
    }

    setVisible(false); // Close the dialog
    setRating(5); // Reset the rating
    // Here, you can send the rating to a server or perform other actions
  };
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <IconButton
            icon={i <= rating ? 'star' : 'star-outline'}
            size={30}
            iconColor={Colors.yellow} // Filled star color
          />
        </TouchableOpacity>,
      );
    }
    return stars;
  };

  return (
    <Portal>
      <Dialog
        style={{backgroundColor: 'white'}}
        visible={visible}
        onDismiss={() => {
          setVisible(false);
        }}>
        <Dialog.Content>
          <View
            style={{
              alignItems: 'center',
              paddingBottom: 10,
              paddingHorizontal: 10,
              borderBottomWidth: 3,
              borderBottomColor: Colors.greenPrimary,
            }}>
            <Text
              style={{
                fontFamily: getFontFamily('bold'),
                color: Colors.black,
                fontSize: 20,
              }}>
              Nhận đồ ăn thành công
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontSize: 16,
                color: Colors.grayText,
                marginTop: 10,
                fontFamily: getFontFamily('regular'),
                alignSelf: 'center',
              }}>
              Bạn vừa nhận được đồ ăn từ {getName(item.description)}. Hãy đánh
              giá chất lượng món ăn của họ nhé!
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginVertical: 10,
              }}>
              {renderStars()}
            </View>
            <Button
              onPress={handleSubmitRating}
              labelStyle={{color: 'white'}}
              style={{
                marginVertical: 10,
                width: 200,
                alignSelf: 'center',
                backgroundColor: Colors.greenPrimary,
                borderRadius: 10,
              }}>
              Đánh giá
            </Button>
          </View>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

export default DialogRating;
