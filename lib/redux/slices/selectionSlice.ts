import { createSlice } from '@reduxjs/toolkit';

interface ISelectionState {
    route: string;
    direction: number;
    placeCode: string;
}

const initialState: ISelectionState = {
  route: '',
  direction: -1,
  placeCode: ''
};

export const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    updateRoute: (state, action) => {
      state.route = action.payload; // set new route
      // reset all other fields
      state.direction = -1;
      state.placeCode = '';
    },
    updateDirection: (state, action) => {
      state.direction = action.payload;
      // reset Placecode
      state.placeCode = '';
    },
    updatePlaceCode: (state, action) => {
      state.placeCode = action.payload;
    },
    resetSelections: (state) => {
      state.route = '';
      state.direction = -1;
      state.placeCode = '';
    }
  }
});

// Action creators are generated for each case reducer function
export const { updateRoute, updateDirection, updatePlaceCode, resetSelections } = selectionSlice.actions;

export default selectionSlice.reducer;