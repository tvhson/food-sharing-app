import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface SharingPost {
  id: number;
  title: string;
  description: string;
  images: Array<string>;
  note: string;
  weight: number;
  expiredDate: Date;
  pickUpStartDate: Date;
  pickUpEndDate: Date;
  status: string;
  locationName: string;
  latitude: number;
  longitude: number;
  receiverId: number | null;
  createdDate: Date;
  portion: number;
  tags: Array<string>;
  isLiked: boolean;
  likeCount: number;
  isReceived: boolean;
  type: string;
  distance: number;
  aicomments: string[];
  author: {
    id: number;
    name: string;
    imageUrl: string;
    locationName: string | null;
    latitude: number | null;
    longitude: number | null;
  };
}

export interface SharingPosts {
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
    setSharingPost: (
      state: SharingPosts,
      action: PayloadAction<SharingPost[]>,
    ) => {
      state.HomePage = action.payload;
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
    likePostReducer: (state: SharingPosts, action: PayloadAction<number>) => {
      state.HomePage = state.HomePage.map(post =>
        post.id === action.payload
          ? {
              ...post,
              isLiked: !post.isLiked,
              likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
            }
          : post,
      );
      state.MyPosts = state.MyPosts.map(post =>
        post.id === action.payload
          ? {
              ...post,
              isLiked: !post.isLiked,
              likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
            }
          : post,
      );
    },
    receivedPostReducer: (
      state: SharingPosts,
      action: PayloadAction<number>,
    ) => {
      state.HomePage = state.HomePage.map(post =>
        post.id === action.payload
          ? {
              ...post,
              isReceived: true,
            }
          : post,
      );
      state.MyPosts = state.MyPosts.map(post =>
        post.id === action.payload
          ? {
              ...post,
              isReceived: true,
            }
          : post,
      );
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
  likePostReducer,
  receivedPostReducer,
  setSharingPost,
} = SharingPostSlice.actions;
export default SharingPostSlice.reducer;
