/* eslint-disable @typescript-eslint/no-unused-vars */
import {Avatar, IconButton} from 'react-native-paper';
import {Bubble, GiftedChat, InputToolbar, Send} from 'react-native-gifted-chat';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
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
  const [infoOther, setInfoOther] = useState<any>(null);
  const [text, setText] = useState('');
  const {showLoading, hideLoading} = useLoading();
  const [isUploadVisible, setIsUploadVisible] = useState(false);
  const [imageUpload, setImageUpload] = useState<any>(null);
  const [imagePath, setImagePath] = useState('');

  const postImage = async (image: any) => {
    setImageUpload(image);
    if (image.path) {
      setImagePath(image.path);
    }
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

  useEffect(() => {
    const connectToMessage = async () => {
      const convertMessage = (message: any) => {
        return {
          _id: message.id,
          text: message.content,
          createdAt: message.timestamp,
          user: {
            _id: message.senderId,
            name: message.senderName,
            avatar:
              message.senderId === userInfo.id
                ? userInfo.imageUrl
                : senderProfilePic === userInfo.imageUrl
                ? recipientProfilePic
                : senderProfilePic,
          },
        };
      };
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
    const convertMessage = (message: any) => {
      return {
        _id: message.id,
        text: message.content,
        createdAt: message.timestamp,
        user: {
          _id: message.senderId,
          name: message.senderName,
          avatar:
            message.senderId === userInfo.id
              ? userInfo.imageUrl
              : senderProfilePic === userInfo.imageUrl
              ? recipientProfilePic
              : senderProfilePic,
        },
      };
    };
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
    async (newMessage: any) => {
      console.log(newMessage);
      const message = {
        senderId: userInfo.id,
        recipientId:
          userInfo.id === item.senderId ? item.recipientId : item.senderId,
        senderName: userInfo.name,
        recipientName:
          userInfo.id === item.senderId ? item.recipientName : item.senderName,
        content: newMessage[0].text,
      };
      sendMessage(message);
      setMessages((previousMessages: any) =>
        GiftedChat.append(previousMessages, newMessage),
      );
      if (roomId === null) {
        await getRoomChats(accessToken)
          .then((response: any) => {
            if (response.status === 200) {
              const roomChats = response.data;
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
                ).then((response2: any) => {
                  console.log(response2);
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
    const dataForm = new FormData();
    if (imageUpload) {
      dataForm.append('file', {
        uri: imageUpload.path,
        name: imageUpload.filename || 'image.jpeg',
        type: imageUpload.mime || 'image/jpeg',
      });
    }

    uploadPhoto(dataForm, accessToken).then((response: any) => {
      if (response.status === 200) {
        console.log(response.data);
      } else {
        console.log(response);
      }
    });
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
      <GiftedChat
        messages={messages}
        locale={dayvi}
        onSend={(newMessage: any) => onSend(newMessage)}
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
        onInputTextChanged={setText}
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
