// store/pushSlice.js
import { createSlice } from "@reduxjs/toolkit";

const pushSlice = createSlice({
  name: "push",
  initialState: {
    subscription: null,
  },
  reducers: {
    setSubscription: (state, action) => {
      state.subscription = action.payload;
    },
  },
});

export const { setSubscription } = pushSlice.actions;
export default pushSlice.reducer;
