import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface Account {
  id: number;
  name: string;
  imageUrl: string;
  locationName: string;
  latitude: number;
  longitude: number;
}
interface IOrganizationPost {
  id: number;
  description: string;
  imageUrl: string;
  createdDate: Date;
  attended: boolean;
  peopleAttended: number;
}
interface IGroupPost {
  accounts: Account;
  organizationposts: IOrganizationPost;
}
interface FundingPosts {
  HomePage: IOrganizationPost[];
  MyPosts: IOrganizationPost[];
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
      action: PayloadAction<IOrganizationPost>,
    ) => {
      state.HomePage.unshift(action.payload);
    },
    pushMyFundingPost: (
      state: FundingPosts,
      action: PayloadAction<IOrganizationPost>,
    ) => {
      state.MyPosts.unshift(action.payload);
    },
    addToTheEndOfFundingPost: (
      state: FundingPosts,
      action: PayloadAction<IOrganizationPost>,
    ) => {
      state.HomePage.push(action.payload);
    },
    setHomePageFundingPost: (
      state: FundingPosts,
      action: PayloadAction<IOrganizationPost[]>,
    ) => {
      state.HomePage = action.payload.slice().reverse();
    },
    setMyFundingPosts: (
      state: FundingPosts,
      action: PayloadAction<IOrganizationPost[]>,
    ) => {
      state.MyPosts = action.payload;
    },

    clearFundingPosts: (state: FundingPosts) => {
      state.HomePage = [];
    },
    clearMyFundingPosts: (state: FundingPosts) => {
      state.MyPosts = [];
    },
  },
});
export const {
  pushFundingPost,
  pushMyFundingPost,
  setHomePageFundingPost,
  setMyFundingPosts,
  clearFundingPosts,
  clearMyFundingPosts,
  addToTheEndOfFundingPost,
} = FundingPostSlice.actions;

export type {FundingPosts, IOrganizationPost, Account};

export default FundingPostSlice.reducer;
