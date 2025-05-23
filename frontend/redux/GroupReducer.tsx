import {PayloadAction, createSlice} from '@reduxjs/toolkit';

import {IGetGroupResponse} from '../api/GroupApi';

interface GroupState {
  groups: IGetGroupResponse[];
}

const initialState: GroupState = {
  groups: [],
};

const GroupSlice = createSlice({
  name: 'Group',
  initialState,
  reducers: {
    setGroup: (
      state: GroupState,
      action: PayloadAction<IGetGroupResponse[]>,
    ) => {
      state.groups = action.payload;
    },
    addGroup: (state: GroupState, action: PayloadAction<IGetGroupResponse>) => {
      const index = state.groups.findIndex(
        group => group.id === action.payload.id,
      );
      if (index === -1) {
        state.groups.push(action.payload);
      } else {
        state.groups[index] = action.payload;
      }
    },
    removeGroup: (state: GroupState, action: PayloadAction<number>) => {
      state.groups = state.groups.filter(group => group.id !== action.payload);
    },
  },
});

export const {setGroup, addGroup, removeGroup} = GroupSlice.actions;

export default GroupSlice.reducer;
