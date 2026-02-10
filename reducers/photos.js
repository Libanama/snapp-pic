import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

export const photosSlice = createSlice({
  name: 'photos',
  initialState,
  reducers: {
    addPhoto: (state, action) => {
      state.value.push(action.payload);
    },
    deletePhoto: (state, action) => {
      state.value = state.value.filter((photo, index) => index !== action.payload);
    },
  },
});

export const { addPhoto, deletePhoto } = photosSlice.actions;
export default photosSlice.reducer;