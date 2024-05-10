import { setLoading, setUserData } from "../redux/reducers/userSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import Axios from "axios";
import toast from "react-hot-toast";

// Base URL for API requests
const baseURL = process.env.REACT_APP_BASE_URL;

// Axios instance with base URL and default headers
const axiosInstance = Axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Axios request interceptor to add authorization token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const token = localStorage.getItem("accessToken");
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Default configuration for Axios requests
const config = {
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
};

// Configuration for content type header
const configCT = { headers: { "Content-Type": "application/json" } };

// Async thunk creator function to generate thunk action creators
export const asyncThunkCreator = (
  name, // Action name
  endpoint, // API endpoint
  method = "post", // HTTP method (default: POST)
  successToast = "" // Success toast message
) =>
  createAsyncThunk(
    name, // Action name
    async ({ dynamicParams, bodyData }, { rejectWithValue }) => {
      try {
        // Ensure method is a valid HTTP method
        const validMethods = ["get", "post", "put", "patch", "delete"];
        if (!validMethods.includes(method.toLowerCase())) {
          throw new Error(`Invalid HTTP method: ${method}`);
        }

        // Construct full URL by replacing dynamic parameters in the endpoint
        let url = `${baseURL}${endpoint}`;
        Object.entries(dynamicParams).forEach(([key, value]) => {
          url = url.replace(`{${key}}`, value);
        });

        // Make the HTTP request using Axios
        const response = await axiosInstance[method](url, bodyData, configCT);

        // If the action is login, store access token and user ID in local storage
        if (name === "auth/loginUser") {
          localStorage.setItem("accessToken", response.data.data.accessToken);
          localStorage.setItem("userId", response.data.data.user_id);
        }

        // Show success toast if provided
        if (successToast) toast.success(successToast);

        // Return response data
        return response.data;
      } catch (error) {
        // Handle errors and reject with error message
        toast.error(error?.response?.data?.message || "Something went wrong!");
        console.log(error);
        return rejectWithValue(
          error.response.data || error.message || "Something went wrong!"
        );
      }
    }
  );

// Export the asyncThunkCreator function
export default asyncThunkCreator;

// Authentication related async thunk action creators
export const registerUser = asyncThunkCreator(
  "auth/registerUser",
  "/user/register",
  "post",
  "Registered successfully!"
);
export const loginUser = asyncThunkCreator(
  "auth/loginUser",
  "/auth/login",
  "post",
  "Logged in successfully!"
);
export const resendEmail = asyncThunkCreator(
  "auth/resendEmail",
  "/auth/resendEmail/{email}",
  "post",
  "Email sent successfully!"
);
export const forgetPassword = asyncThunkCreator(
  "auth/forgetPassword",
  "/auth/forgetPassword/{email}",
  "patch",
  "Password reset link sent to your email!"
);
export const resetPassword = asyncThunkCreator(
  "auth/resetPassword",
  "/auth/resetPassword/{token}",
  "patch",
  "Password reset was successful!"
);
export const verifyEmail = asyncThunkCreator(
  "auth/verifyEmail",
  "/auth/verifyEmail/{token}",
  "patch"
);

// User profile related async thunk action creators
export const getProfile = createAsyncThunk(
  "user/fetchUserData",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in localStorage");
      }
      const response = await axiosInstance.get(
        `${baseURL}/profile/${userId}`,
        configCT
      );
      dispatch(setUserData(response.data));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getProfileById = createAsyncThunk(
  "profile/fetchProfileData",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await Axios.get(`${baseURL}/profile/${userId}`, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editInfo = asyncThunkCreator(
  "user/editInfoData",
  "/profile/{userId}",
  "patch",
  "Successfully done!"
);
export const editProfile = asyncThunkCreator(
  "user/editInfoData",
  "/user/{userId}",
  "patch",
  "Successfully done!"
);
export const editSettings = asyncThunkCreator(
  "user/editInfoData",
  "/misc/profile/{userId}",
  "patch",
  "Successfully done!"
);

// Experience related async thunk action creators
export const addExperience = asyncThunkCreator(
  "user/addExperienceData",
  "/profile/addExperience/{userId}",
  "post",
  "Experience Added Successfully!"
);
export const editExperience = asyncThunkCreator(
  "user/editExperienceData",
  "/profile/editExperience/{userId}/{experienceId}",
  "patch",
  "Experience Edited Successfully!"
);
export const deleteExperience = asyncThunkCreator(
  "user/deleteExperienceData",
  "/profile/removeExperience/{userId}/{experienceId}",
  "delete",
  "Experience Deleted Successfully!"
);

// Language related async thunk action creators
export const addLanguage = asyncThunkCreator(
  "user/addLanguageData",
  "/profile/addLanguage/{userId}",
  "post",
  "Language Added Successfully"
);
export const deleteLanguage = asyncThunkCreator(
  "user/deletelanguageData",
  "/profile/removeLanguage/{userId}/{languageId}",
  "delete",
  "Language Deleted Successfully!"
);
export const editLanguage = asyncThunkCreator(
  "user/editlanguageData",
  "/profile/editLanguage/{userId}/{languageId}",
  "patch",
  "Language Edited Successfully!"
);

// Project related async thunk action creators
export const addProject = asyncThunkCreator(
  "user/addProjectData",
  "/profile/addProject/{userId}",
  "post",
  "Project Added Successfully!"
);
export const editProject = asyncThunkCreator(
  "user/editprojectData",
  "/profile/editProject/{userId}/{projectId}",
  "patch",
  "Project Edited Successfully!"
);
export const deleteProject = asyncThunkCreator(
  "user/deleteProjectData",
  "/profile/removeProject/{userId}/{projectId}",
  "delete",
  "Project Deleted Successfully!"
);

// Education related async thunk action creators
export const addEducation = asyncThunkCreator(
  "user/addEducationData",
  "/profile/addEducation/{userId}",
  "post",
  "Education Added Successfully!"
);
export const editEducation = asyncThunkCreator(
  "user/editeducationData",
  "/profile/editEducation/{userId}/{educationId}",
  "patch",
  "Education Edited Successfully!"
);
export const deleteEducation = asyncThunkCreator(
  "user/deleteEducationData",
  "/profile/removeEducation/{userId}/{educationId}",
  "delete",
  "Education Deleted Successfully!"
);

// Async thunk action creators for job-related actionse
export const getJobById = createAsyncThunk(
  "job/fetchJobById",
  async ({ jobId, userId, sort }, thunkAPI) => {
    try {
      const response = await Axios.get(
        `${baseURL}/offer/specific/${jobId}/${userId}?proposalSort=${sort}`,
        config
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getJobs = createAsyncThunk(
  "job/fetchJobData",
  async (
    {
      user_id,
      minBudget = "",
      maxBudget = "",
      project_size = "",
      sortOrder = "",
      sortBy = "",
    },
    thunkAPI
  ) => {
    try {
      const response = await Axios.get(
        `${baseURL}/offer/${user_id}?minBudget=${minBudget}&maxBudget=${maxBudget}&project_size=${project_size}&sortOrder=${sortOrder}&sortBy=${sortBy}`,
        config
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getAllJobs = createAsyncThunk(
  "job/fetchAllJobsData",
  async (
    {
      user_id,
      searchTerm = "",
      minBudget = "",
      maxBudget = "",
      project_size = "",
      sortOrder = "",
      sortBy = "",
      category = "",
    },
    thunkAPI
  ) => {
    try {
      const response = await Axios.get(
        `${baseURL}/offer/all/${user_id}?searchTerm=${searchTerm}&minBudget=${minBudget}&maxBudget=${maxBudget}&project_size=${project_size}&sortOrder=${sortOrder}&sortBy=${sortBy}&category=${category}`,
        config
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getBookmarks = createAsyncThunk(
  "job/fetchBookmarks",
  async (userId, thunkAPI) => {
    try {
      const response = await Axios.get(
        `${baseURL}/bookmark/user/${userId}`,
        config
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getMyJobs = createAsyncThunk(
  "job/fetchMyJobs",
  async (userId, thunkAPI) => {
    try {
      const response = await Axios.get(
        `${baseURL}/offer/user/${userId}`,
        config
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addJob = asyncThunkCreator(
  "user/addJobData",
  "/offer/create/",
  "post",
  "Job Added Successfully!"
);
export const editJob = asyncThunkCreator(
  "user/editJobData",
  "/offer/{jobId}",
  "patch",
  "Job Edited Successfully!"
);
export const deleteJob = asyncThunkCreator(
  "user/deleteJobData",
  "/offer/{jobId}",
  "delete",
  "Job Deleted Successfully!"
);
export const addBookmark = asyncThunkCreator(
  "user/addBookmark",
  "/bookmark/create/",
  "post",
  "Job Bookmarked Successfully!"
);

export const deleteBookmark = asyncThunkCreator(
  "user/deleteBookmarkData",
  "/bookmark/{bookmarkId}",
  "delete",
  "Bookmark Removed Successfully!"
);
export const addProposal = asyncThunkCreator(
  "user/addProposal",
  "/proposal/create/",
  "post",
  "Proposal Submitted Successfully!"
);
export const editProposal = asyncThunkCreator(
  "user/editProposalData",
  "/proposal/{proposalId}",
  "patch",
  "Proposal Edited Successfully!"
);
export const acceptProposal = asyncThunkCreator(
  "user/acceptProposalData",
  "/proposal/accept/{proposalId}/{jobId}",
  "patch",
  "Proposal Accepted Successfully!"
);
export const acceptJob = asyncThunkCreator(
  "user/acceptProposalData",
  "/offer/acceptInvitation/{jobId}/{userId}",
  "patch",
  "Job Accepted Successfully!"
);
export const deleteProposal = asyncThunkCreator(
  "user/deleteProposalData",
  "/proposal/{proposalId}",
  "delete",
  "Proposal Deleted Successfully!"
);
export const requestCompletion = asyncThunkCreator(
  "user/requestCompletionData",
  "/offer/requestCompletion/{id}",
  "post",
  "Requested the client to mark the job as completed!"
);
export const markAsCompleted = asyncThunkCreator(
  "user/requestCompletionData",
  "/offer/complete/{jobId}/{userId}",
  "patch",
  "Marked the job as completed!"
);
export const giveClientReview = asyncThunkCreator(
  "user/requestCompletionData",
  "/offer/addClientReview/{userId}/{jobId}",
  "post",
  "Gave the client the review!"
);
export const cancelJob = asyncThunkCreator(
  "user/cancelJobData",
  "/offer/cancel/{jobId}",
  "delete",
  "Job canceled Successfully!"
);
export const hireNow = asyncThunkCreator(
  "user/requestCompletionData",
  "/offer/hireMe/{id}",
  "post",
  "Job notification sent to the freelancer!"
);
// Async thunk action creators for category-related actions
export const getCategories = createAsyncThunk(
  "category/fetchCategoryData",
  async (search, thunkAPI) => {
    try {
      const response = await Axios.get(
        `${baseURL}/category?searchTerm=${search}`,
        config
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getPopularCategories = createAsyncThunk(
  "category/fetchCategoryData",
  async (_, thunkAPI) => {
    try {
      const response = await Axios.get(`${baseURL}/category/popular`, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getCategoriesById = createAsyncThunk(
  "category/fetchCategoryById",
  async (
    {
      id,
      search = "",
      country = "",
      overall_rating = "",
      min_hourly_rate = "",
      max_hourly_rate = "",
    },
    thunkAPI
  ) => {
    try {
      const response = await Axios.get(
        `${baseURL}/category/${id}?searchTerm=${search}&country=${country}&overall_rating=${overall_rating}&min_hourly_rate=${min_hourly_rate}&max_hourly_rate=${max_hourly_rate}`,
        config
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getEmployeesByCategory = createAsyncThunk(
  "category/fetchEmployeesByCategory",
  async (id, thunkAPI) => {
    try {
      const response = await Axios.get(
        `${baseURL}/misc/employees/${id}`,
        config
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk action creators for country actions
export const getCountries = createAsyncThunk(
  "country/fetchCountryData",
  async (_, thunkAPI) => {
    try {
      const response = await Axios.get(`${baseURL}/misc/countries`, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
// Async thunk action creators for skills actions
export const getSkills = createAsyncThunk(
  "skills/fetchSkillsData",
  async (_, thunkAPI) => {
    try {
      const response = await Axios.get(`${baseURL}/skill`, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getHires = createAsyncThunk(
  "Hires/fetchSkillsData",
  async ({ userId, search, status }, thunkAPI) => {
    try {
      const response = await Axios.get(
        `${baseURL}/offer/hired/${userId}?searchTerm=${search}&status=${status}`,
        config
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getClients = createAsyncThunk(
  "Clients/fetchSkillsData",
  async ({ userId, search, status }, thunkAPI) => {
    try {
      const response = await Axios.get(
        `${baseURL}/offer/client/${userId}?searchTerm=${search}&status=${status}`,
        config
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const getNotifications = createAsyncThunk(
  "Clients/fetchSkillsData",
  async (userId, thunkAPI) => {
    try {
      const response = await Axios.get(
        `${baseURL}/notification/${userId}`,
        config
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const patchReadNotifications = createAsyncThunk(
  "Clients/fetchSkillsData",
  async (userId, thunkAPI) => {
    try {
      const response = await Axios.patch(
        `${baseURL}/notification/readNotification/${userId}`,
        config
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
export const postInitiateChat = createAsyncThunk(
  "Chat/fetchSkillsData",
  async (userId, thunkAPI) => {
    try {
      const response = await Axios.post(
        `https://adminapisgp.im.qcloud.com/v4/im_open_login_svc/account_import`,
        { userId },
        config
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getTerms = createAsyncThunk(
  "Clients/fetchSkillsData",
  async (_, thunkAPI) => {
    try {
      const response = await Axios.get(`${baseURL}/misc/terms`, config);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
