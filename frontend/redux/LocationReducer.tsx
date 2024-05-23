import {PayloadAction, createSlice} from '@reduxjs/toolkit';

interface Location {
  latitude: number;
  longitude: number;
}
const initialState: Location = {
  latitude: 0,
  longitude: 0,
};
const LocationSlice = createSlice({
  name: 'Location',
  initialState,
  reducers: {
    setLocation: (state: Location, action: PayloadAction<Location>) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
  },
});
export const {setLocation} = LocationSlice.actions;
export default LocationSlice.reducer;
