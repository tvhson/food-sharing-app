import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface SharingPost {
  id: number;
  title: string;
  description: string;
  images: Array<string>;
  note: string;
  expiredDate: Date;
  pickUpStartDate: Date;
  pickUpEndDate: Date;
  status: string;
  locationName: string;
  latitude: number;
  longitude: number;
  createdById: number;
  receiverId: number;
  createdDate: Date;
}

interface SharingPosts {
  HomePage: SharingPost[];
  MyPosts: SharingPost[];
}
const initialState: SharingPosts = {
  HomePage: [],
  MyPosts: [],
};

const SharingPostSlice = createSlice({
  name: 'SharingPost',
  initialState,
  reducers: {
    pushSharingPost: (
      state: SharingPosts,
      action: PayloadAction<SharingPost>,
    ) => {
      state.HomePage.push(action.payload);
    },
    pushMyPost: (state: SharingPosts, action: PayloadAction<SharingPost>) => {
      state.MyPosts.push(action.payload);
    },
    setHomePage: (
      state: SharingPosts,
      action: PayloadAction<SharingPost[]>,
    ) => {
      state.HomePage = action.payload;
    },
    setMyPosts: (state: SharingPosts, action: PayloadAction<SharingPost[]>) => {
      state.MyPosts = action.payload;
    },
    updateMyPost: (state: SharingPosts, action: PayloadAction<SharingPost>) => {
      state.MyPosts = state.MyPosts.map(post =>
        post.id === action.payload.id ? action.payload : post,
      );
      state.HomePage = state.HomePage.map(post =>
        post.id === action.payload.id ? action.payload : post,
      );
    },
    deleteMyPost: (state: SharingPosts, action: PayloadAction<number>) => {
      state.MyPosts = state.MyPosts.filter(post => post.id !== action.payload);
      state.HomePage = state.HomePage.filter(
        post => post.id !== action.payload,
      );
    },
    clearSharingPosts: (state: SharingPosts) => {
      state.HomePage = [];
    },
    clearMyPosts: (state: SharingPosts) => {
      state.MyPosts = [];
    },
  },
});

export const {
  pushSharingPost,
  pushMyPost,
  setHomePage,
  setMyPosts,
  updateMyPost,
  deleteMyPost,
  clearSharingPosts,
  clearMyPosts,
} = SharingPostSlice.actions;
export default SharingPostSlice.reducer;
