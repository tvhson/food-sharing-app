import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {UserInfo} from './UserReducer';

interface Accounts {
  user: UserInfo[];
  organization: UserInfo[];
}
const initialState: Accounts = {
  user: [],
  organization: [],
};
const AccountsSlice = createSlice({
  name: 'Accounts',
  initialState,
  reducers: {
    setAccounts: (state: Accounts, action: PayloadAction<UserInfo[]>) => {
      state.user = action.payload.filter(account => account.role === 'USER');
      state.organization = action.payload.filter(
        account => account.role === 'ORGANIZATION',
      );
    },
    changeRole: (state: Accounts, action: PayloadAction<UserInfo>) => {
      const accountFound = state.user.find(
        account => account.id === action.payload.id,
      );
      if (accountFound) {
        accountFound.role = 'ORGANIZATION';
        state.organization.push(accountFound);
        state.user = state.user.filter(
          account => account.id !== action.payload.id,
        );
      } else {
        const account = state.organization.find(
          account2 => account2.id === action.payload.id,
        );
        if (account) {
          account.role = 'USER';
          state.user.push(account);
          state.organization = state.organization.filter(
            account2 => account2.id !== action.payload.id,
          );
        }
      }
    },
    clearAccounts: (state: Accounts) => {
      state.user = [];
      state.organization = [];
    },
  },
});

export const {setAccounts, changeRole, clearAccounts} = AccountsSlice.actions;
export default AccountsSlice.reducer;
