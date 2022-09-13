import { createSlice } from '@reduxjs/toolkit';
import { IDepartures, IDirection, IStop } from '../../interfaces';

interface IdataState {
    directionsData: IDirection[] | null;
    stopsData: IStop[] | null;
    departuresData: IDepartures | null;
}

const initialState: IdataState = {
  directionsData: null,
  stopsData: null,
  departuresData: null
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    updateDirectionsData: (state, action) => {
      state.directionsData = action.payload;
      // reset all other fields
      state.stopsData = null;
      state.departuresData = null;
    },
    updateStopsData: (state, action) => {
      state.stopsData = action.payload;
      // reset departures
      state.departuresData = null;
    },
    updateDeparturesData: (state, action) => {
      state.departuresData = action.payload;
    },
    resetData: (state) => {
      state.directionsData = null;
      state.stopsData = null;
      state.departuresData = null;
    }
  }
});

// Action creators are generated for each case reducer function
export const { updateDirectionsData, updateStopsData, updateDeparturesData, resetData } = dataSlice.actions;

export default dataSlice.reducer;