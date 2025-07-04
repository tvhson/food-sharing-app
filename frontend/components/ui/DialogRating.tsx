import React, {useMemo, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Button, Dialog, IconButton, Portal} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {earnPoint} from '../../api/LoyaltyApi';
import {
  createNotification,
  updateNotification,
} from '../../api/NotificationApi';
import Colors from '../../global/Color';
import {updateNotificationAfter} from '../../redux/NotificationReducer';
import {RootState} from '../../redux/Store';
import {getFontFamily} from '../../utils/fonts';
import {Rating} from '@rneui/themed';

const DialogRating = (props: {
  visible: boolean;
  setVisible: (value: boolean) => void;
  item: any;
}) => {
  const {visible, setVisible, item} = props;
  const accessToken = useSelector((state: RootState) => state.token.key);
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const [rating, setRating] = useState(5);
  const stars = useMemo(() => {
    const arr = [];
    for (let i = 1; i <= 5; i++) {
      arr.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <IconButton
            icon={i <= rating ? 'star' : 'star-outline'}
            size={30}
            iconColor={Colors.yellow}
          />
        </TouchableOpacity>,
      );
    }
    return arr;
  }, [rating]);

  if (!item) {
    return null;
  }

  const getName = (str: string) => {
    const nameMatch = str.match(/^(.*?)\s+đã/);

    return nameMatch ? nameMatch[1].trim() : null;
  };
  const handleSubmitRating = async () => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  return (
    <Portal>
      {/* <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <ActivityIndicator size="large" color={Colors.greenPrimary} />
      </View> */}

      <Dialog
        style={{backgroundColor: 'white'}}
        visible={visible}
        onDismiss={() => {
          setVisible(false);
          setRating(5);
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
            <Rating
              showRating
              imageSize={40}
              onFinishRating={setRating}
              style={{paddingVertical: 10}}
            />
            <Button
              loading={isLoading}
              disabled={isLoading}
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
