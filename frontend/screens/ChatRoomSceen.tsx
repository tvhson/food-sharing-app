/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {GiftedChat, Send} from 'react-native-gifted-chat';
import {
  connectMessage,
  disconnectMessage,
  getMessages,
  sendMessage,
} from '../api/ChatApi';
import Colors from '../global/Color';
import {Avatar, Icon, IconButton} from 'react-native-paper';
import {BackHandler} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/Store';

const ChatRoomScreen = ({navigation, route}: any) => {
  const accessToken = useSelector((state: RootState) => state.token.key);
  const item = route.params.item;
  const userInfo = useSelector((state: RootState) => state.userInfo);

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
                : recipientProfilePic,
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
      connectMessage(item.id, saveMessage);
    };
    connectToMessage();
  }, [
    item.id,
    recipientProfilePic,
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
      getMessages(item.id, accessToken).then((response: any) => {
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
    loadMessages();
  }, [
    accessToken,
    item.id,
    recipientProfilePic,
    senderProfilePic,
    userInfo.id,
    userInfo.imageUrl,
  ]);

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
        onSend={(newMessage: any) => {
          const message = {
            senderId: userInfo.id,
            recipientId:
              userInfo.id === item.senderId ? item.recipientId : item.senderId,
            senderName: userInfo.name,
            recipientName:
              userInfo.id === item.senderId
                ? item.recipientName
                : item.senderName,
            content: newMessage[0].text,
          };
          sendMessage(message);
          setMessages((previousMessages: any) =>
            GiftedChat.append(previousMessages, newMessage),
          );
        }}
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
        key={item.id}
        keyboardShouldPersistTaps={'handled'}
      />
    </View>
  );
};

export default ChatRoomScreen;
