import {configureStore} from '@reduxjs/toolkit';
import UserReducer from './UserReducer';
import LoadingReducer from './LoadingReducer';
import TokenReducer from './TokenReducer';
import SharingPostReducer from './SharingPostReducer';
import OrganizationPostReducer from './OrganizationPostReducer';
import LocationReducer from './LocationReducer';
import NotificationReducer from './NotificationReducer';
import ChatRoomReducer from './ChatRoomReducer';
import ReportReducer from './ReportReducer';
import AccountsReducer from './AccountsReducer';
import CommentReducer from './CommentReducer';
export const Store = configureStore({
  reducer: {
    userInfo: UserReducer,
    loading: LoadingReducer,
    token: TokenReducer,
    sharingPost: SharingPostReducer,
    fundingPost: OrganizationPostReducer,
    location: LocationReducer,
    notification: NotificationReducer,
    chatRoom: ChatRoomReducer,
    report: ReportReducer,
    account: AccountsReducer,
    comment: CommentReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof Store.getState>;
