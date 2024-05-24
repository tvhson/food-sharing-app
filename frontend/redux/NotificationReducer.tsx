import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {readAllNotifications} from '../api/NotificationApi';

interface Notification {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  type: string;
  createdDate: Date;
  linkId: number;
  userId: number;
  read: boolean;
}

interface Notifications {
  notifications: Notification[];
  numberOfUnread: number;
}
const initialState: Notifications = {
  notifications: [],
  numberOfUnread: 0,
};
const NotificationSlice = createSlice({
  name: 'Notification',
  initialState,
  reducers: {
    setNotifications: (
      state: Notifications,
      action: PayloadAction<Notification[]>,
    ) => {
      state.notifications = action.payload;
    },
    addNotification: (
      state: Notifications,
      action: PayloadAction<Notification>,
    ) => {
      state.notifications.unshift(action.payload);
      state.numberOfUnread++;
    },
    readNotification: (state: Notifications, action: PayloadAction<number>) => {
      state.notifications = state.notifications.map(notification =>
        notification.id === action.payload
          ? {...notification, read: true}
          : notification,
      );
    },
    setReadAllNotifications: (state: Notifications) => {
      state.notifications = state.notifications.map(notification => ({
        ...notification,
        read: true,
      }));
      state.numberOfUnread = 0;
    },
    clearNotifications: (state: Notifications) => {
      state.notifications = [];
    },
    countNumberOfUnread: (state: Notifications) => {
      state.numberOfUnread = state.notifications.filter(
        notification => !notification.read,
      ).length;
    },
    clearNumberOfUnread: (state: Notifications) => {
      state.numberOfUnread = 0;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  readNotification,
  clearNotifications,
  countNumberOfUnread,
  clearNumberOfUnread,
  setReadAllNotifications,
} = NotificationSlice.actions;
export default NotificationSlice.reducer;
