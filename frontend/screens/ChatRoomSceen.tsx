/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {GiftedChat, Send} from 'react-native-gifted-chat';
import {
  connectMessage,
  disconnectMessage,
  getMessages,
  getRoomChats,
  readAllMessagesOfRoom,
  sendMessage,
} from '../api/ChatApi';
import Colors from '../global/Color';
import {Avatar, Icon, IconButton} from 'react-native-paper';
import {BackHandler} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/Store';
import {createNotification} from '../api/NotificationApi';
import {useFocusEffect} from '@react-navigation/native';
import {readAllMessageOfRoomChatId} from '../redux/ChatRoomReducer';

const ChatRoomScreen = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.token.key);
  const item = route.params.item;
  const userInfo = useSelector((state: RootState) => state.userInfo);
  const [roomId, setRoomId] = useState(item.id ? item.id : null);

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
      getMessages(roomId, accessToken).then((response: any) => {
        if (response.status === 200) {
          const convertedMessages = response.data
            .map((message: any) => convertMessage(message))
            .reverse();
          setMessages(convertedMessages);
        } else {
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
      await sendMessage(message);
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
              if (roomChat) {
                setRoomId(roomChat.id);
                createNotification(
                  {
                    title: 'You have a new message',
                    imageUrl:
                      userInfo.imageUrl ||
                      'https://randomuser.me/api/portraits/men/36.jpg',
                    description: userInfo.name + ' has sent you a message',
                    type: 'MESSAGE',
                    linkId: roomChat.id,
                    userId: item.recipientId,
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

  return (
    <View style={{flex: 1, backgroundColor: Colors.background}}>
      <View
        style={{
          height: 60,
          width: '100%',
          backgroundColor: Colors.button,
          borderBottomWidth: 1,
          borderBlockColor: '#ccc',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
        }}>
        <View style={{position: 'absolute', top: -1, left: 10}}>
          <IconButton
            icon="chevron-left"
            size={40}
            iconColor="white"
            onPress={() => {
              disconnectMessage();
              navigation.goBack();
            }}
          />
        </View>
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
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
          }}>
          {userInfo.id === item.senderId ? item.recipientName : item.senderName}
        </Text>
      </View>
      <GiftedChat
        messages={messages}
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
            <Send {...props}>
              <View style={{marginRight: 10, marginBottom: 10}}>
                <Icon source="send" size={24} color={Colors.button} />
              </View>
            </Send>
          );
        }}
        alwaysShowSend
        keyboardShouldPersistTaps={'handled'}
      />
    </View>
  );
};

export default ChatRoomScreen;
