import {Stomp} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import ApiManager, {baseUrl} from './ApiManager';

var stompClient: any = null;

const connectStompClient = (url: string) => {
  const socketFactory = () => new SockJS(url);
  return Stomp.over(socketFactory);
};

export const connectNotification = async (
  userId: number,
  showNotification: (body: any) => void,
) => {
  stompClient = connectStompClient(`${baseUrl}ws-notifications`);

  return new Promise((resolve, reject) => {
    stompClient.connect(
      {},
      function (frame: any) {
        console.log('Connected: ' + frame);
        stompClient.subscribe(
          '/user/' + userId + '/queue/notifications',
          function (notification: any) {
            showNotification(JSON.parse(notification.body));
          },
        );
        resolve(frame);
      },
      function (error: any) {
        console.error('Notification connection error: ', error);
        reject(error);
      },
    );
  });
};

export const disconnectSocket = () => {
  if (stompClient !== null && stompClient.connected) {
    stompClient.disconnect(() => {
      console.log('Disconnected');
    });
  } else {
    console.log('No connection to disconnect');
  }
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
    console.error('Error fetching notifications: ', error);
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
    console.error('Error marking all notifications as read: ', error);
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
    console.error('Error creating notification: ', error);
    return error;
  }
};
export const updateNotification = async (id: any, token: any, data: any) => {
  try {
    const response = await ApiManager('notifications/update/' + id, {
      method: 'PUT',
      headers: {
        Authorization: token,
      },
      data: data,
    });
    return response;
  } catch (error) {
    console.error('Error updating notification: ', error);
    return error;
  }
};

// Helper function to ensure connection before performing actions
const ensureConnected = () => {
  if (!stompClient || !stompClient.connected) {
    throw new Error('STOMP client is not connected');
  }
};

export const sendMessage = (message: any) => {
  try {
    ensureConnected();
    stompClient.send('/app/message', {}, JSON.stringify(message));
  } catch (error) {
    console.error('Error sending message: ', error);
  }
};
