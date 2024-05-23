import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  role: string;
  birthDate: Date;
  imageUrl: string;
  phone: string;
  description: string;
  status: string;
  bannedDate: Date;
  locationName: string;
  latitude: number;
  longitude: number;
}

const initialState: UserInfo = {
  id: 0,
  name: '',
  email: '',
  role: '',
  birthDate: new Date(),
  imageUrl: '',
  phone: '',
  description: '',
  status: '',
  bannedDate: new Date(),
  locationName: '',
  latitude: 0,
  longitude: 0,
};

const UserSlice = createSlice({
  name: 'UserInfo',
  initialState,
  reducers: {
    saveUser: (state: UserInfo, action: PayloadAction<UserInfo>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.birthDate = action.payload.birthDate;
      state.imageUrl = action.payload.imageUrl;
      state.phone = action.payload.phone || '';
      state.description = action.payload.description || '';
      state.status = action.payload.status;
      state.bannedDate = action.payload.bannedDate;
      state.locationName = action.payload.locationName;
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
    updateAvatar: (state: UserInfo, action: PayloadAction<string>) => {
      state.imageUrl = action.payload;
    },
  },
});

export const {saveUser, updateAvatar} = UserSlice.actions;
export default UserSlice.reducer;
