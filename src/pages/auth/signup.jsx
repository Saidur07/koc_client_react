import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  registerUser,
  resendEmail,
  getCategories,
  getCountries,
} from "../axios/axios";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { MdHome } from "react-icons/md";
import { IconButton, Stack, Typography } from "@mui/material";
import Grow from "@mui/material/Grow";
import { Link } from "react-router-dom";
import Select from "react-tailwindcss-select";
import { LockReset } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { editInfo, postInitiateChat } from "../../axios/axios";
import { turkishCities } from "../../constants/data";

const SignupPage = () => {
  // State variables
  const [state, setState] = useState("signup");

  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState({
    signup: false,
    resendEmail: false,
    fetchData: false,
    info: false,
  });
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [characterCount, setCharacterCount] = useState(0);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [disableResendButton, setDisableResendButton] = useState(false);

  const navigate = useNavigate();

  const dispatch = useDispatch();

  // Form validation using react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Fetch categories and countries data
  useEffect(() => {
    const fetchData = async () => {
      setLoading({ ...loading, fetchData: true });
      try {
        // Fetch categories data
        const categoriesResponse = await dispatch(getCategories(""));
        setCategoryOptions(
          categoriesResponse?.payload?.data?.map((item) => ({
            value: item._id,
            label: item.name,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading({ ...loading, fetchData: false });
    };

    fetchData();
  }, [dispatch]);

  // Handle form submission
  const onsubmit = async (data) => {
    setLoading({ ...loading, signup: true });
    try {
      // Register user
      const response = await dispatch(
        registerUser({
          dynamicParams: {},
          bodyData: {
            ...data,
            country: "Turkey",
            city: selectedCity.value,
            category: selectedCategory.value,
            role: "user",
          },
        })
      );
      if (
        response.payload.statusCode === 200 ||
        response.payload.statusCode === 201
      ) {
        setUserId(response.payload.data._id);
        setUserEmail(data.email);
        setState("info");
        dispatch(postInitiateChat(response.payload.data._id))
          .then((response) => {
            // Handle successful response
            console.log("API call successful:", response);
          })
          .catch((error) => {
            // Handle error
            console.error("API call failed:", error);
          });
      }
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setLoading({ ...loading, signup: false });
    }
  };

  // Handle info update
  const handleInfoUpdate = async (data) => {
    setLoading({ ...loading, info: true });
    try {
      const response = await dispatch(
        editInfo({
          dynamicParams: {
            userId: userId,
          },
          bodyData: data,
        })
      );
      if (
        response.payload.statusCode === 200 ||
        response.payload.statusCode === 201
      ) {
        setState("verify");
        dispatch(
          resendEmail({
            dynamicParams: { email: userEmail },
            bodyData: { email: userEmail },
          })
        );
      }
    } catch (error) {
      console.error("Resend email failed:", error);
    } finally {
      setLoading({ ...loading, resendEmail: false });
    }
  };
  // Handle resending verification email
  const handleResendEmail = async () => {
    setLoading({ ...loading, resendEmail: true });
    try {
      const response = await dispatch(
        resendEmail({
          dynamicParams: { email: userEmail },
          bodyData: { email: userEmail },
        })
      );
      if (
        response.payload.statusCode === 200 ||
        response.payload.statusCode === 201
      ) {
        // Start the timer
        setTimer(60);
        setDisableResendButton(true);
      }
    } catch (error) {
      console.error("Resend email failed:", error);
    } finally {
      setLoading({ ...loading, resendEmail: false });
    }
  };
  // Update timer every second
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setDisableResendButton(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);
  return (
    <Stack
      className="auth-back"
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Grow in={true}>
        <Stack direction="row" justifyContent="center">
          {state === "signup" && (
            <div className="register-wrap rounded-none md:rounded-[10px]">
              <div
                className="flex items-center justify-center text-gray-300 cursor-pointer mx-auto gap-x-1 my-4"
                onClick={() => navigate(`/`)}
              >
                <MdHome className="text-xl " />
                <p className="text-lg hover:underline ">KOC Freelancing</p>
              </div>
              <h4 className="auth-title">Kayıt Ol</h4>
              <form onSubmit={handleSubmit(onsubmit)}>
                <Stack direction="row" justifyContent="center">
                  <Stack sx={{ width: "80%" }}>
                    <Stack direction="row">
                      <div className="p-1 w-full">
                        <label
                          htmlFor="category"
                          className="col-span-full font-medium my-1"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id="first_name"
                          name="first_name"
                          {...register("first_name", { required: true })}
                          className=" bg-[#1f2029] focus:text-[#a09fa3] text-base border-none rounded-md border my-1 p-3 w-full !outline-none  font-poppins"
                          placeholder="First Name"
                        />
                        {errors.first_name && (
                          <span className="w-full text-red-400 -mt-1 cursor-context-menu ml-1">
                            This field is required
                          </span>
                        )}
                      </div>
                      <div className="p-1 w-full">
                        <label
                          htmlFor="category"
                          className="col-span-full font-medium my-1"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          {...register("lastName", { required: true })}
                          className=" bg-[#1f2029] my-1  text-base border-none rounded-md border  p-3 w-full !outline-none  font-poppins"
                          placeholder="Last Name"
                        />
                        {errors.lastName && (
                          <span className="w-full text-red-400 -mt-1 cursor-context-menu ml-1">
                            This field is required
                          </span>
                        )}
                      </div>
                    </Stack>
                    <div className="">
                      <label
                        htmlFor="category"
                        className="col-span-full font-medium my-1"
                      >
                        Category
                      </label>
                      <Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e)}
                        options={categoryOptions}
                        isSearchable
                        loading={loading.signup}
                        primaryColor={"lime"}
                        placeholder="Select Category"
                        classNames={{
                          menuButton: ({ isDisabled }) =>
                            `flex rounded-lg text-gray-100 my-1 border border-[#1f2029] p-[2px] shadow-sm transition-all duration-300 focus:outline-none ${
                              isDisabled
                                ? "text-gray-400"
                                : "bg-[#1f2029] hover:border-gray-400 focus:border-primary focus:ring focus:ring-primary/10"
                            }`,
                          menu: "absolute z-10 w-full bg-[#1f2029] shadow-lg  rounded py-2 mt-1.5 rounded-lg text-gray-300",
                          listItem: ({ isSelected }) =>
                            `block transition duration-200 p-2 rounded-lg cursor-pointer select-none truncate rounded text-gray-300 ${
                              isSelected
                                ? `bg-gray-300 text-gray-900`
                                : `hover:bg-gray-300 hover:text-gray-900`
                            }`,
                        }}
                      />
                      {!selectedCategory && (
                        <span className="w-full text-red-400  -mt-1 cursor-context-menu">
                          This field is required
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-x-2">
                      <div className="w-full">
                        <label
                          htmlFor="country"
                          className="col-span-full font-medium "
                        >
                          Country
                        </label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          className=" bg-[#1f2029] my-1  text-base border-none rounded-md border  p-3 w-full !outline-none  font-poppins"
                          placeholder="Country"
                          value="Turkey"
                          disabled
                        />
                      </div>
                      <div className="w-full">
                        <label
                          htmlFor="city"
                          className="col-span-full font-medium my-1"
                        >
                          Province
                        </label>
                        <div className="relative">
                          <Select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e)}
                            options={turkishCities}
                            isSearchable
                            primaryColor={"lime"}
                            placeholder="Select Your Province"
                            classNames={{
                              menuButton: ({ isDisabled }) =>
                                `flex rounded-lg text-gray-100 my-1 border border-[#1f2029] p-[2px] shadow-sm transition-all duration-300 focus:outline-none ${
                                  isDisabled
                                    ? "text-gray-400 bg-[#1f2029]"
                                    : "bg-[#1f2029] hover:border-gray-400 focus:border-primary focus:ring focus:ring-primary/10"
                                }`,
                              menu: "absolute z-10 w-full bg-[#1f2029] shadow-lg  rounded py-2 mt-1.5 rounded-lg text-gray-300",
                              listItem: ({ isSelected }) =>
                                `block transition duration-200 p-2 rounded-lg cursor-pointer select-none truncate rounded text-gray-300 ${
                                  isSelected
                                    ? `bg-gray-300 text-gray-900`
                                    : `hover:bg-gray-300 hover:text-gray-900`
                                }`,
                            }}
                          />
                          {(!selectedCity || selectedCity === "") && (
                            <span className="w-full text-red-400  -mt-1 cursor-context-menu">
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-1">
                      <label
                        htmlFor="Phone"
                        className="col-span-full font-medium "
                      >
                        Phone
                      </label>
                      <div className="bg-[#1f2029] rounded-md my-1  p-3 w-full flex items-center ">
                        <LocalPhoneIcon sx={{ color: "#ffeba7" }} />
                        <input
                          type="tel"
                          id="phone_number"
                          name="phone_number"
                          {...register("phone_number", { required: true })}
                          className=" mx-2 bg-[#1f2029]  text-base border-none  w-full !outline-none  font-poppins"
                          placeholder="Ex. +90 5xxxxxxxxx"
                        />
                      </div>
                    </div>
                    {errors.phone_number && (
                      <span className="w-full text-red-400 -mt-1 cursor-context-menu ml-1">
                        This field is required
                      </span>
                    )}
                    <div className="p-1">
                      <label
                        htmlFor="Email"
                        className="col-span-full font-medium my-1"
                      >
                        Email
                      </label>
                      <div className="bg-[#1f2029] rounded-md my-1  p-3 w-full flex items-center ">
                        <MarkunreadIcon sx={{ color: "#ffeba7" }} />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          {...register("email", { required: true })}
                          className=" mx-2 bg-[#1f2029]  text-base border-none  w-full !outline-none  font-poppins"
                          placeholder="Ex. example@gmail.com"
                        />
                      </div>
                    </div>
                    {errors.email && (
                      <span className="w-full text-red-400 -mt-1 cursor-context-menu ml-1">
                        This field is required
                      </span>
                    )}
                    <div className="p-1">
                      <label
                        htmlFor="country"
                        className="col-span-full font-medium my-2"
                      >
                        Password
                      </label>
                      <div className="bg-[#1f2029] rounded-md  my-1 p-3 w-full flex items-center ">
                        <LockReset sx={{ color: "#ffeba7" }} />
                        <input
                          type="password"
                          id="password"
                          name="password"
                          {...register("password", {
                            required: true,
                            minLength: 6,
                          })}
                          className=" mx-2 bg-[#1f2029]  text-base border-none  w-full !outline-none  font-poppins"
                          placeholder="Password"
                        />
                      </div>
                    </div>
                    {errors.password && (
                      <span className="w-full text-red-400 -mt-1 cursor-context-menu ml-1">
                        Password must be atleast 6 characters
                      </span>
                    )}
                    <div className="flex items-center">
                      <div className="inline-flex items-center">
                        <label
                          className="relative flex cursor-pointer items-center rounded-full p-2"
                          htmlFor="checkbox-1"
                          data-ripple-dark="true"
                        >
                          <input
                            type="checkbox"
                            id="checkbox-1"
                            className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border  transition-all before:absolute checked:border-[#1f2029] checked:bg-[#1f2029]"
                            checked={isChecked}
                            onChange={(e) => setIsChecked(!isChecked)}
                            required
                          />
                          <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3.5 w-3.5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              stroke="currentColor"
                              strokeWidth={1}
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        </label>
                      </div>
                      <p className="text-base">
                        <Link
                          className="underline font-medium cursor-pointer hover:no-underline"
                          to="/terms"
                        >
                          Kullanıcı Sözleşmesi
                        </Link>
                      </p>
                    </div>
                  </Stack>
                </Stack>
                <Stack direction="row" justifyContent="center">
                  {loading.signup ? (
                    <div className="btn !cursor-context-menu !px-16 hover:bg-[#ffeaa7af]">
                      <div className="loaderAuth mx-auto"></div>{" "}
                    </div>
                  ) : (
                    <button type="submit" className="btn" disabled={!isChecked}>
                      Kayıt Ol
                    </button>
                  )}
                </Stack>
              </form>
              <Stack direction="row" justifyContent="center" alignSelf="center">
                <Typography sx={{ color: "#c4c3ca" }}>
                  Zaten hesabınız var mı?{" "}
                </Typography>
                <Link to="/auth/login" className="auth-change-btn">
                  Log In
                </Link>
              </Stack>
            </div>
          )}
          {state === "info" ? (
            <form
              className="register-wrap"
              onSubmit={handleSubmit(handleInfoUpdate)}
            >
              <Stack
                direction="row"
                justifyContent="start"
                alignItems="center"
                marginBottom={2}
              >
                <h4 className="text-xl ml-8">Tell us about yourself</h4>
              </Stack>
              <Stack direction="row" justifyContent="center" paddingX="45px">
                <Stack sx={{ width: "100%" }}>
                  <div className="p-1">
                    <label
                      htmlFor="Title"
                      className="col-span-full font-medium "
                    >
                      Your Work Title
                    </label>
                    <div className="bg-[#1f2029] rounded-md my-1  p-3 w-full flex items-center ">
                      <input
                        type="text"
                        id="sub_title"
                        name="sub_title"
                        {...register("sub_title", { required: true })}
                        className=" mx-2 bg-[#1f2029]  text-base border-none  w-full !outline-none  font-poppins"
                        placeholder="Ex. Senior QA Engineer"
                      />
                    </div>
                  </div>
                  {errors.sub_title && (
                    <span className="w-full text-red-400 -mt-1 cursor-context-menu ml-1">
                      This field is required
                    </span>
                  )}
                  <div className="p-1">
                    <label
                      htmlFor="hourly_rate"
                      className="col-span-full font-medium "
                    >
                      Your Hourly Rate (USD)
                    </label>
                    <div className="bg-[#1f2029] rounded-md my-1  p-3 w-full flex items-center ">
                      <input
                        type="number"
                        id="hourly_rate"
                        name="hourly_rate"
                        {...register("hourly_rate", { required: true })}
                        className=" mx-2 bg-[#1f2029]  text-base border-none  w-full !outline-none  font-poppins"
                        placeholder="Ex. 20"
                      />
                    </div>
                  </div>
                  {errors.hourly_rate && (
                    <span className="w-full text-red-400 -mt-1 cursor-context-menu ml-1">
                      This field is required
                    </span>
                  )}
                  <div className="p-1">
                    <label
                      htmlFor="description"
                      className="col-span-full font-medium my-1"
                    >
                      Description
                    </label>
                    <div className="bg-[#1f2029] rounded-md my-1  p-3 w-full flex items-center ">
                      <textarea
                        rows={6}
                        id="description"
                        name="description"
                        {...register("description", {
                          required: true,
                          minLength: 100,
                          maxLength: 5000,
                        })}
                        className="mx-2 bg-[#1f2029] text-base border-none w-full !outline-none font-poppins"
                        placeholder="Example: I often describe myself as a QA professional in a developer's body, having the mindset to break things but the toolset to create and restore. I also have several years of experience as a QA Engineer."
                        onChange={(e) =>
                          setCharacterCount(e.target.value.length)
                        }
                      />
                    </div>
                    <p className="text-end text-gray-300 text-sm">
                      {5000 - characterCount} characters left
                    </p>
                    {errors.description?.type === "required" && (
                      <span className="text-red-400">
                        This field is required
                      </span>
                    )}
                    {errors.description?.type === "minLength" && (
                      <span className="text-red-400">
                        Description must be at least 100 characters
                      </span>
                    )}
                    {errors.description?.type === "maxLength" && (
                      <span className="text-red-400">
                        Description cannot exceed 5000 characters
                      </span>
                    )}
                  </div>
                </Stack>
              </Stack>
              <Stack direction="row" justifyContent="center">
                {loading.info ? (
                  <div className="btn !cursor-context-menu !px-16 hover:bg-[#ffeaa7af]">
                    <div className="loaderAuth mx-auto"></div>{" "}
                  </div>
                ) : (
                  <button className="btn " type="submit">
                    <p>Submit</p>{" "}
                  </button>
                )}
              </Stack>
            </form>
          ) : state === "verify" ? (
            <div className="reset-wrap">
              <Stack
                direction="row"
                justifyContent="start"
                alignItems="center"
                marginBottom={2}
              >
                <IconButton
                  onClick={() => setState("info")}
                  sx={{ marginLeft: "20px" }}
                >
                  <ArrowBackIosNewIcon sx={{ color: "grey" }} />
                </IconButton>
                <h4 className="text-xl">Verify Your Email</h4>
              </Stack>
              <Stack
                direction="column"
                justifyContent="start"
                alignSelf="center"
                paddingX="45px"
              >
                <Typography sx={{ color: "#c4c3ca" }}>
                  We have sent a verification email to your inbox. Verify your
                  email to continue.{" "}
                </Typography>
                <br />
                <Typography sx={{ color: "#c4c3ca" }}>
                  Didn&apos;t receive an email?{" "}
                  {timer < 1 ? (
                    <span
                      className={`auth-change-btn cursor-pointer ${
                        disableResendButton ? "hidden" : ""
                      }`}
                      onClick={() => handleResendEmail()}
                    >
                      Resend email.
                    </span>
                  ) : (
                    <span>{`Resend email in ${timer} seconds.`}</span>
                  )}
                </Typography>
              </Stack>
            </div>
          ) : state === "loggedIn" ? (
            <div className="reset-wrap">
              <Stack direction="row" justifyContent="start" alignItems="center">
                <h4 className="auth-title">There&apos;s nothing here</h4>
              </Stack>
              <Stack
                direction="column"
                justifyContent="start"
                alignSelf="center"
                paddingX="45px"
              >
                <Typography sx={{ color: "#c4c3ca" }}>
                  You are already logged in.
                </Typography>
                <br />
                <Typography sx={{ color: "#c4c3ca" }}>
                  <Link to="/" className="auth-change-btn cursor-pointer">
                    Go back to home.
                  </Link>
                </Typography>
              </Stack>
            </div>
          ) : null}
        </Stack>
      </Grow>
    </Stack>
  );
};

export default SignupPage;
