import {Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import ApiManager from './ApiManager';
import {baseUrl} from './ApiManager';

var stompClient: any = null;
var stompClientMessage: any = null;

const connectStompClient = (url: string) => {
  const socketFactory = () => new SockJS(url);
  return Stomp.over(socketFactory);
};

export const connectChat = async (
  userId: number,
  showNotification: (body: any) => void,
) => {
  stompClient = connectStompClient(`${baseUrl}ws-chats`);

  return new Promise((resolve, reject) => {
    stompClient.connect(
      {},
      function (frame: any) {
        console.log('Connected to chat: ' + frame);
        stompClient.subscribe(
          '/user/' + userId + '/queue/rooms',
          function (notification: any) {
            showNotification(JSON.parse(notification.body));
          },
        );
        resolve(frame);
      },
      function (error: any) {
        console.error('Chat connection error: ', error);
        reject(error);
      },
    );
  });
};

export const connectMessage = async (
  roomId: number,
  showNotification: (body: any) => void,
) => {
  stompClientMessage = connectStompClient(`${baseUrl}ws-chats`);

  return new Promise((resolve, reject) => {
    stompClientMessage.connect(
      {},
      function (frame: any) {
        console.log('Connected to messages: ' + frame);
        stompClientMessage.subscribe(
          '/user/' + roomId + '/queue/messages',
          function (notification: any) {
            showNotification(JSON.parse(notification.body));
          },
        );
        resolve(frame);
      },
      function (error: any) {
        console.error('Message connection error: ', error);
        reject(error);
      },
    );
  });
};

export const disconnectChat = () => {
  if (stompClient !== null) {
    stompClient.disconnect(() => {
      console.log('Chat disconnected');
    });
  } else {
    console.log('No chat connection to disconnect');
  }
};

export const disconnectMessage = () => {
  if (stompClientMessage !== null) {
    stompClientMessage.disconnect(() => {
      console.log('Message disconnected');
    });
  } else {
    console.log('No message connection to disconnect');
  }
};

export const sendMessage = (message: any) => {
  if (stompClient && stompClient.connected) {
    stompClient.send('/app/message', {}, JSON.stringify(message));
  } else {
    console.error('Cannot send message, chat client is not connected');
  }
};

export const getRoomChats = async (token: any) => {
  try {
    const response = await ApiManager('chats/rooms', {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching room chats: ', error);
    return error;
  }
};

export const getMessages = async (roomId: any, token: any) => {
  try {
    const response = await ApiManager('chats/messages/' + roomId, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching messages: ', error);
    return error;
  }
};

export const readAllMessagesOfRoom = async (roomId: any, token: any) => {
  try {
    const response = await ApiManager('chats/rooms/' + roomId, {
      method: 'PUT',
      headers: {
        Authorization: token,
      },
    });
    return response;
  } catch (error) {
    console.error('Error reading all messages of room: ', error);
    return error;
  }
};
