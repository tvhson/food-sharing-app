import AccountsReducer from './AccountsReducer';
import ChatRoomReducer from './ChatRoomReducer';
import CommentReducer from './CommentReducer';
import GroupReducer from './GroupReducer';
import LoadingReducer from './LoadingReducer';
import LocationReducer from './LocationReducer';
import NotificationReducer from './NotificationReducer';
import OrganizationPostReducer from './OrganizationPostReducer';
import ReportReducer from './ReportReducer';
import SharingPostReducer from './SharingPostReducer';
import TokenReducer from './TokenReducer';
import UserReducer from './UserReducer';
import {configureStore} from '@reduxjs/toolkit';
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
    group: GroupReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof Store.getState>;
