import {Avatar, Icon, IconButton} from 'react-native-paper';
import {
  Bubble,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
} from 'react-native-gifted-chat';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {
  connectMessage,
  disconnectMessage,
  getMessages,
  getRoomChats,
  readAllMessagesOfRoom,
  sendMessage,
} from '../api/ChatApi';
import {useDispatch, useSelector} from 'react-redux';

import {BackHandler} from 'react-native';
import Colors from '../global/Color';
import {RootState} from '../redux/Store';
import UploadPhoto from '../components/ui/UploadPhoto';
import {ZegoSendCallInvitationButton} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import analytics from '@react-native-firebase/analytics';
import {createNotification} from '../api/NotificationApi';
import dayjs from 'dayjs';
import dayvi from 'dayjs/locale/vi';
import {getFontFamily} from '../utils/fonts';
import {readAllMessageOfRoomChatId} from '../redux/ChatRoomReducer';
import {scale} from '../utils/scale';
import {uploadPhoto} from '../api/UploadPhotoApi';
import {useFocusEffect} from '@react-navigation/native';
import {useLoading} from '../utils/LoadingContext';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

dayjs.locale('vi');

const ChatRoomScreen = ({navigation, route}: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.token.key);
  const item = route.params.item;
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [roomId, setRoomId] = useState(item.id ? item.id : null);

  const {showLoading, hideLoading} = useLoading();
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [imageUpload, setImageUpload] = useState<any>(null);

  const postImage = async (image: any) => {
    setImageUpload(image);
  };

  const recipientProfilePic =
    item.recipientProfilePic === null
      ? 'https://randomuser.me/api/portraits/men/36.jpg'
      : item.recipientProfilePic;
  const senderProfilePic =
    item.senderProfilePic === null
      ? 'https://randomuser.me/api/portraits/men/36.jpg'
      : item.senderProfilePic;

  const [messages, setMessages] = useState<any>([]);

  const convertMessage = (message: any) => {
    return {
      _id: message?.id,
      text: message?.content,
      createdAt: message?.timestamp,
      user: {
        _id: message?.senderId,
        name: message?.senderName,
        avatar:
          message?.senderId === userInfo.id
            ? userInfo.imageUrl
            : senderProfilePic === userInfo.imageUrl
            ? recipientProfilePic
            : senderProfilePic,
      },
      image: message?.imageUrl,
    };
  };

  useEffect(() => {
    const connectToMessage = async () => {
      const saveMessage = (message: any) => {
        if (message.senderId === userInfo.id) {
          return;
        }
        const convertedMessage = convertMessage(message);

        setMessages((prevMessages: any) => [convertedMessage, ...prevMessages]);
      };
      connectMessage(roomId, saveMessage);
    };
    if (roomId) {
      connectToMessage();
    }
  }, [
    item,
    recipientProfilePic,
    roomId,
    senderProfilePic,
    userInfo.id,
    userInfo.imageUrl,
    userInfo.name,
  ]);

  useEffect(() => {
    const backAction = () => {
      disconnectMessage();
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [navigation]);

  useEffect(() => {
    const loadMessages = async () => {
      showLoading();
      getMessages(roomId, accessToken).then((response: any) => {
        if (response.status === 200) {
          const convertedMessages = response.data
            .map((message: any) => convertMessage(message))
            .reverse();
          setMessages(convertedMessages);
          hideLoading();
        } else {
          hideLoading();
          console.log(response);
        }
      });
    };
    if (roomId) {
      loadMessages();
    }
  }, [
    accessToken,
    recipientProfilePic,
    roomId,
    senderProfilePic,
    userInfo.id,
    userInfo.imageUrl,
  ]);

  const onSend = useCallback(
    async (newMessage: IMessage[]) => {
      showLoading();
      let imageUrl = null;
      const dataForm = new FormData();
      if (imageUpload) {
        dataForm.append('file', {
          uri: imageUpload.path,
          name: imageUpload.filename || 'image.jpeg',
          type: imageUpload.mime || 'image/jpeg',
        });
      }
      const response: any = await uploadPhoto(dataForm, accessToken);
      if (response?.status === 200) {
        imageUrl = response?.data[0];
      } else {
        console.log(response);
        hideLoading();
      }
      const message = {
        senderId: userInfo.id,
        recipientId:
          userInfo.id === item.senderId ? item.recipientId : item.senderId,
        senderName: userInfo.name,
        recipientName:
          userInfo.id === item.senderId ? item.recipientName : item.senderName,
        content: newMessage[0].text,
        imageUrl: imageUrl,
      };
      sendMessage(message);
      setImageUpload(null);
      setMessages((previousMessages: IMessage[]) => {
        const updatedNewMessages = newMessage.map(msg => ({
          ...msg,
          image: imageUrl,
        }));
        return GiftedChat.append(previousMessages, updatedNewMessages);
      });
      hideLoading();
      if (roomId === null) {
        await getRoomChats(accessToken)
          .then((response2: any) => {
            if (response2.status === 200) {
              const roomChats = response2.data;
              const roomChat = roomChats.find(
                (room: any) =>
                  room.senderId === item.senderId &&
                  room.recipientId === item.recipientId,
              );
              analytics().logEvent('chat', {
                roomChatId: roomChat.id,
                senderId: item.senderId,
                recipientId: item.recipientId,
              });
              if (roomChat) {
                setRoomId(roomChat.id);
                createNotification(
                  {
                    title: 'Bạn có tin nhắn mới',
                    imageUrl:
                      userInfo.imageUrl ||
                      'https://randomuser.me/api/portraits/men/36.jpg',
                    description: userInfo.name + ' đã gửi tin nhắn cho bạn',
                    type: 'MESSAGE',
                    linkId: roomChat.id,
                    userId: item.recipientId,
                    senderId: userInfo.id,
                  },
                  accessToken,
                ).then((response3: any) => {
                  console.log(response3);
                });
              }
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    [
      accessToken,
      item.recipientId,
      item.recipientName,
      item.senderId,
      item.senderName,
      roomId,
      userInfo.id,
      userInfo.imageUrl,
      userInfo.name,
    ],
  );

  useFocusEffect(
    useCallback(() => {
      const readAllMessages = async () => {
        if (accessToken) {
          readAllMessagesOfRoom(roomId, accessToken)
            .then((response: any) => {
              if (response.status === 200) {
                console.log(response.data);
                dispatch(readAllMessageOfRoomChatId(roomId));
              } else {
                console.log(response);
              }
            })
            .catch(error => {
              console.log(error);
            });
        }
      };
      readAllMessages();
      return readAllMessages;
    }, [accessToken, dispatch, roomId]),
  );

  const handleUploadImage = async () => {
    let imageUrl = null;
    const dataForm = new FormData();
    if (imageUpload) {
      dataForm.append('file', {
        uri: imageUpload.path,
        name: imageUpload.filename || 'image.jpeg',
        type: imageUpload.mime || 'image/jpeg',
      });
    }

    uploadPhoto(dataForm, accessToken).then((response: any) => {
      if (response?.status === 200) {
        imageUrl = response?.data[0];
      } else {
        console.log(response);
      }
    });
    return imageUrl;
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.white}}>
      <UploadPhoto
        title="Thêm ảnh"
        isVisible={isUploadVisible}
        setVisible={setIsUploadVisible}
        height={300}
        width={350}
        isCircle={false}
        postImage={postImage}
      />
      <View
        style={{
          height: 60,
          width: '100%',
          backgroundColor: Colors.white,
          alignItems: 'center',
          justifyContent: 'space-between',
          flexDirection: 'row',
          elevation: 5,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <IconButton
            icon="chevron-left"
            size={30}
            iconColor="black"
            onPress={() => {
              disconnectMessage();
              navigation.goBack();
            }}
          />
          <Avatar.Image
            size={40}
            source={{
              uri:
                userInfo.id === item.senderId
                  ? recipientProfilePic
                  : senderProfilePic,
            }}
            style={{marginRight: 10}}
          />
          <Text
            style={{
              fontSize: 20,
              fontFamily: getFontFamily('semibold'),
              color: 'black',
            }}>
            {userInfo.id === item.senderId
              ? item.recipientName
              : item.senderName}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingRight: 10,
          }}>
          <View style={{marginRight: 10}}>
            <ZegoSendCallInvitationButton
              invitees={[
                {
                  userID:
                    userInfo.id === item.senderId
                      ? item.recipientId.toString()
                      : item.senderId.toString(),
                  userName:
                    userInfo.id === item.senderId
                      ? item.recipientName.toString()
                      : item.senderName.toString(),
                },
              ]}
              resourceID={'happyfood_call'}
            />
          </View>

          <ZegoSendCallInvitationButton
            invitees={[
              {
                userID:
                  userInfo.id === item.senderId
                    ? item.recipientId.toString()
                    : item.senderId.toString(),
                userName:
                  userInfo.id === item.senderId
                    ? item.recipientName.toString()
                    : item.senderName.toString(),
              },
            ]}
            isVideoCall={true}
            resourceID={'happyfood_call'}
          />
        </View>
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: scale(45),
          width: '100%',
        }}>
        {imageUpload && (
          <View style={{padding: 10}}>
            <TouchableOpacity
              onPress={() => setImageUpload(null)}
              style={{
                position: 'absolute',
                top: scale(14),
                left: scale(56),
                zIndex: 10,
                backgroundColor: Colors.white,
                borderRadius: scale(100),
                padding: scale(2),
              }}>
              <Icon source="close" size={14} color={Colors.black} />
            </TouchableOpacity>
            <Image
              source={{uri: imageUpload.path}}
              style={{
                width: scale(70),
                height: scale(70),
                borderRadius: scale(10),
                borderWidth: 1,
                borderColor: Colors.gray,
              }}
            />
          </View>
        )}
      </View>

      <GiftedChat
        messages={messages}
        locale={dayvi}
        onSend={(newMessage: IMessage[]) => onSend(newMessage)}
        user={{
          _id: userInfo.id,
          name: userInfo.name,
          avatar: userInfo.imageUrl
            ? userInfo.imageUrl
            : 'https://randomuser.me/api/portraits/men/36.jpg',
        }}
        renderSend={props => {
          return (
            <View
              style={{
                flexDirection: 'row',
                height: 50,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
              <Send {...props}>
                <View style={{marginRight: 10, marginBottom: 10}}>
                  <Image
                    source={require('../assets/images/send-message.png')}
                    style={{width: 30, height: 30}}
                  />
                </View>
              </Send>
            </View>
          );
        }}
        renderInputToolbar={props => (
          <InputToolbar
            {...props}
            renderActions={() => (
              <View
                style={{
                  height: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TouchableOpacity onPress={() => setIsUploadVisible(true)}>
                  <Image
                    source={require('../assets/images/paperclip.png')}
                    style={{width: 30, height: 30, marginLeft: 10}}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
        renderBubble={props => (
          <Bubble
            {...props}
            // wrapperStyle={{
            //   left: {
            //     backgroundColor: Colors.primary,
            //   },
            //   right: {
            //     backgroundColor: Colors.primary,
            //   },
            // }}
            textStyle={{
              left: {
                color: Colors.black,
                fontFamily: getFontFamily('regular'),
                fontSize: 16,
              },
              right: {
                color: Colors.white,
                fontFamily: getFontFamily('regular'),
                fontSize: 16,
              },
            }}
          />
        )}
        textInputProps={styles.composer}
        alwaysShowSend
        keyboardShouldPersistTaps={'handled'}
        placeholder="Nhập tin nhắn..."
        bottomOffset={insets.bottom}
      />
    </View>
  );
};

export default ChatRoomScreen;

const styles = StyleSheet.create({
  composer: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
    alignSelf: 'center',
    fontFamily: getFontFamily('regular'),
    fontSize: 16,
  },
});
