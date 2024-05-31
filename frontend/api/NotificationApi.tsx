import {Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import ApiManager from './ApiManager';

var stompClient: any = null;
export const connectNotification = async (
  userId: number,
  showNotification: (body: any) => void,
) => {
  const socketFactory = () =>
    new SockJS('http://34.172.57.110:8072/ws-notifications');
  stompClient = Stomp.over(socketFactory);

  stompClient.connect({}, function (frame: any) {
    console.log('Connected: ' + frame);
    stompClient.subscribe(
      '/user/' + userId + '/queue/notifications',
      function (notification: any) {
        showNotification(JSON.parse(notification.body));
      },
    );
  });
};
export const disconnectSocket = () => {
  if (stompClient !== null) {
    stompClient.disconnect();
  }
  console.log('Disconnected');
};
export const getNotifications = async (token: any) => {
  try {
    const response = await ApiManager('notifications', {
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
export const readAllNotifications = async (token: any) => {
  try {
    const response = await ApiManager('notifications/read-all', {
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
export const createNotification = async (data: any, token: any) => {
  try {
    const result = await ApiManager('notifications', {
      method: 'POST',
      headers: {
        Authorization: token,
      },
      data: data,
    });
    return result;
  } catch (error) {
    return error;
  }
};
