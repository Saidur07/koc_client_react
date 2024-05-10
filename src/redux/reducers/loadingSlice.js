// loadingSlice.ts

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Define other initial state properties here
  loading: false,
};

export const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Define other reducers for your slice here
  },
});

export const { setLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
