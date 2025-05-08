import {PayloadAction, createSlice} from '@reduxjs/toolkit';

export interface Token {
  key: string;
}
const initialState: Token = {
  key: '',
};

const TokenSlice = createSlice({
  name: 'Token',
  initialState,
  reducers: {
    setToken: (state: Token, action: PayloadAction<string>) => {
      state.key = action.payload;
    },
  },
});

export const {setToken} = TokenSlice.actions;
export default TokenSlice.reducer;
