import { configureStore } from "@reduxjs/toolkit";
import loadingSlice from "./reducers/loadingSlice";
import jobSlice from "./reducers/jobSlice";
import userSlice from "./reducers/userSlice";
import authSlice from "./reducers/authSlice";
import categorySlice from "./reducers/categorySlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    user: userSlice,
    loading: loadingSlice,
    jobs: jobSlice,
    categories: categorySlice,
  },
});

export default store;
