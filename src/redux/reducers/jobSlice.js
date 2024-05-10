import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllJobs,
  getBookmarks,
  getJobById,
  getJobs,
  getMyJobs,
} from "../../axios/axios";

const jobSlice = createSlice({
  name: "job",
  initialState: {
    jobs: [],
    allJobs: [],
    bookmarks: [],
    myJobs: [],
    jobData: {},
    status: "idle",
    error: null,
  },
  reducers: {
    // Add any synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(getJobs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jobs = action.payload;
      })
      .addCase(getJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getAllJobs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allJobs = action.payload;
      })
      .addCase(getAllJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getBookmarks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getBookmarks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.bookmarks = action.payload;
      })
      .addCase(getBookmarks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getMyJobs.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMyJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.myJobs = action.payload;
      })
      .addCase(getMyJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getJobById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jobData = action.payload;
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default jobSlice.reducer;
