import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface Account {
  id: number;
  name: string;
  imageUrl: string;
  locationName: string;
  latitude: number;
  longitude: number;
}
interface OrganizationPost {
  id: number;
  title: string;
  description: string;
  peopleAttended: number;
  imageUrl: string;
  createdDate: Date;
  linkWebsites: string;
  userId: number;
  locationName: string;
  latitude: number;
  longitude: number;
  attended: boolean;
  startDate: Date;
}
interface FundingPost {
  accounts: Account;
  organizationposts: OrganizationPost;
}
interface FundingPosts {
  HomePage: FundingPost[];
  MyPosts: FundingPost[];
}
const initialState: FundingPosts = {
  HomePage: [],
  MyPosts: [],
};
const FundingPostSlice = createSlice({
  name: 'FundingPost',
  initialState,
  reducers: {
    pushFundingPost: (
      state: FundingPosts,
      action: PayloadAction<FundingPost>,
    ) => {
      state.HomePage.unshift(action.payload);
    },
    pushMyFundingPost: (
      state: FundingPosts,
      action: PayloadAction<FundingPost>,
    ) => {
      state.MyPosts.unshift(action.payload);
    },
    addToTheEndOfFundingPost: (
      state: FundingPosts,
      action: PayloadAction<FundingPost>,
    ) => {
      state.HomePage.push(action.payload);
    },
    setHomePageFundingPost: (
      state: FundingPosts,
      action: PayloadAction<FundingPost[]>,
    ) => {
      state.HomePage = action.payload.slice().reverse();
    },
    setMyFundingPosts: (
      state: FundingPosts,
      action: PayloadAction<FundingPost[]>,
    ) => {
      state.MyPosts = action.payload;
    },
    updateMyFundingPost: (
      state: FundingPosts,
      action: PayloadAction<FundingPost>,
    ) => {
      state.MyPosts = state.MyPosts.map(post =>
        post.organizationposts.id === action.payload.organizationposts.id
          ? action.payload
          : post,
      );
      state.HomePage = state.HomePage.map(post =>
        post.organizationposts.id === action.payload.organizationposts.id
          ? action.payload
          : post,
      );
    },
    deleteMyFundingPost: (
      state: FundingPosts,
      action: PayloadAction<number>,
    ) => {
      state.MyPosts = state.MyPosts.filter(
        post => post.organizationposts.id !== action.payload,
      );
      state.HomePage = state.HomePage.filter(
        post => post.organizationposts.id !== action.payload,
      );
    },
    clearFundingPosts: (state: FundingPosts) => {
      state.HomePage = [];
    },
    clearMyFundingPosts: (state: FundingPosts) => {
      state.MyPosts = [];
    },
    attendPost: (state: FundingPosts, action: PayloadAction<number>) => {
      state.MyPosts = state.MyPosts.map(post =>
        post.organizationposts.id === action.payload
          ? {
              ...post,
              organizationposts: {
                ...post.organizationposts,
                attended: !post.organizationposts.attended,
                peopleAttended: post.organizationposts.attended
                  ? post.organizationposts.peopleAttended - 1
                  : post.organizationposts.peopleAttended + 1,
              },
            }
          : post,
      );
      state.HomePage = state.HomePage.map(post =>
        post.organizationposts.id === action.payload
          ? {
              ...post,
              organizationposts: {
                ...post.organizationposts,
                attended: !post.organizationposts.attended,
                peopleAttended: post.organizationposts.attended
                  ? post.organizationposts.peopleAttended - 1
                  : post.organizationposts.peopleAttended + 1,
              },
            }
          : post,
      );
    },
  },
});
export const {
  pushFundingPost,
  pushMyFundingPost,
  setHomePageFundingPost,
  setMyFundingPosts,
  updateMyFundingPost,
  deleteMyFundingPost,
  clearFundingPosts,
  clearMyFundingPosts,
  addToTheEndOfFundingPost,
  attendPost,
} = FundingPostSlice.actions;
export default FundingPostSlice.reducer;
