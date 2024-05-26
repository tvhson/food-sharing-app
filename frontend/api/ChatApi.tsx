import {Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import ApiManager from './ApiManager';

var stompClient: any = null;
var stompClientMessage: any = null;

export const connectChat = async (
  userId: number,
  showNotification: (body: any) => void,
) => {
  const socketFactory = () => new SockJS('http://34.172.57.110:8072/ws-chats');
  stompClient = Stomp.over(socketFactory);

  stompClient.connect({}, function (frame: any) {
    console.log('Connected: ' + frame);
    stompClient.subscribe(
      '/user/' + userId + '/queue/rooms',
      function (notification: any) {
        showNotification(JSON.parse(notification.body));
      },
    );
  });
};

export const connectMessage = async (
  roomId: number,
  showNotification: (body: any) => void,
) => {
  const socketFactory = () => new SockJS('http://34.172.57.110:8072/ws-chats');
  stompClientMessage = Stomp.over(socketFactory);

  stompClientMessage.connect({}, function (frame: any) {
    console.log('Connected: ' + frame);
    stompClientMessage.subscribe(
      '/user/' + roomId + '/queue/messages',
      function (notification: any) {
        showNotification(JSON.parse(notification.body));
      },
    );
  });
};
export const disconnectChat = () => {
  if (stompClient !== null) {
    stompClient.disconnect();
  }
  console.log('Disconnected');
};
export const disconnectMessage = () => {
  if (stompClientMessage !== null) {
    stompClientMessage.disconnect();
  }
  console.log('Disconnected');
};

export const sendMessage = (message: any) => {
  stompClientMessage.send('/app/message', {}, JSON.stringify(message));
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
    return error;
  }
};
