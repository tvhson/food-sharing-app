import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface Account {
  id: number;
  name: string;
  imageUrl: string;
  locationName: string | null;
  latitude: string | null;
  longitude: string | null;
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
  HomePage: IGroupPost[];
}
const initialState: FundingPosts = {
  HomePage: [],
};
const FundingPostSlice = createSlice({
  name: 'FundingPost',
  initialState,
  reducers: {
    setHomePageFundingPost: (
      state: FundingPosts,
      action: PayloadAction<IGroupPost[]>,
    ) => {
      state.HomePage = action.payload;
    },
    clearFundingPosts: (state: FundingPosts) => {
      state.HomePage = [];
    },
    setGroupPost: (state: FundingPosts, action: PayloadAction<IGroupPost>) => {
      const index = state.HomePage.findIndex(
        post =>
          post.organizationposts.id === action.payload.organizationposts.id,
      );
      if (index !== -1) {
        state.HomePage[index] = action.payload;
      } else {
        state.HomePage.unshift(action.payload);
      }
    },
    likeGroupPost: (state: FundingPosts, action: PayloadAction<number>) => {
      const postId = action.payload;
      const postIndex = state.HomePage.findIndex(
        post => post.organizationposts.id === postId,
      );
      state.HomePage[postIndex].organizationposts.attended =
        !state.HomePage[postIndex].organizationposts.attended;
      if (state.HomePage[postIndex].organizationposts.attended) {
        state.HomePage[postIndex].organizationposts.peopleAttended =
          state.HomePage[postIndex].organizationposts.peopleAttended + 1;
      } else {
        state.HomePage[postIndex].organizationposts.peopleAttended =
          state.HomePage[postIndex].organizationposts.peopleAttended - 1;
      }
    },
  },
});
export const {
  setHomePageFundingPost,
  clearFundingPosts,
  likeGroupPost,
  setGroupPost,
} = FundingPostSlice.actions;

export type {FundingPosts, IOrganizationPost, Account};

export default FundingPostSlice.reducer;
