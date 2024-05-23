import {configureStore} from '@reduxjs/toolkit';
import UserReducer from './UserReducer';
import LoadingReducer from './LoadingReducer';
import TokenReducer from './TokenReducer';
import SharingPostReducer from './SharingPostReducer';
import OrganizationPostReducer from './OrganizationPostReducer';
import LocationReducer from './LocationReducer';
export const Store = configureStore({
  reducer: {
    userInfo: UserReducer,
    loading: LoadingReducer,
    token: TokenReducer,
    sharingPost: SharingPostReducer,
    fundingPost: OrganizationPostReducer,
    location: LocationReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof Store.getState>;
