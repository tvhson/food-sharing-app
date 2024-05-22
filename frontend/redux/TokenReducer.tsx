import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface Token {
  key: any;
}
const initialState: Token = {
  key: null,
};

const TokenSlice = createSlice({
  name: 'Token',
  initialState,
  reducers: {
    setToken: (state: Token, action: PayloadAction<any>) => {
      state.key = action.payload;
    },
  },
});

export const {setToken} = TokenSlice.actions;
export default TokenSlice.reducer;
