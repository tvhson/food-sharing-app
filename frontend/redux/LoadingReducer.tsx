import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface Loading {
  status: boolean;
}
const initialState: Loading = {
  status: false,
};

const LoadingSlice = createSlice({
  name: 'Loading',
  initialState,
  reducers: {
    setStatus: (state: Loading, action: PayloadAction<boolean>) => {
      state.status = action.payload;
    },
  },
});

export const {setStatus} = LoadingSlice.actions;
export default LoadingSlice.reducer;
