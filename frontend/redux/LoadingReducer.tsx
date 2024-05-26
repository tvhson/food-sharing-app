import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface Loading {
  status: boolean;
  loadFunding: boolean;
}
const initialState: Loading = {
  status: false,
  loadFunding: false,
};

const LoadingSlice = createSlice({
  name: 'Loading',
  initialState,
  reducers: {
    setStatus: (state: Loading, action: PayloadAction<boolean>) => {
      state.status = action.payload;
    },
    setLoadFunding: (state: Loading, action: PayloadAction<boolean>) => {
      state.loadFunding = action.payload;
    },
  },
});

export const {setStatus, setLoadFunding} = LoadingSlice.actions;
export default LoadingSlice.reducer;
