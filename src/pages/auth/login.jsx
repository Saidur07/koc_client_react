import React, { useEffect, useState } from "react";
import { IconButton, Stack, Typography } from "@mui/material";
import StartAodornmentField from "../components/form/startAodornmentField";
import PasswordField from "../components/form/passwordField";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Grow from "@mui/material/Grow";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  forgetPassword,
  getProfile,
  loginUser,
  resendEmail,
} from "../axios/axios";
import toast from "react-hot-toast";
import { MdHome } from "react-icons/md";

const LoginPage = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState("login");
  const [showResendButton, setShowResendButton] = useState(true);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState({
    login: false,
    forgetPassword: false,
    resendEmail: false,
  });
  const navigate = useNavigate();

  const handlePwd = (value) => {
    setPassword(value);
  };
  const handleChange = (value) => {
    setValue(value);
  };
  const handleClick = (value) => {
    setState(value);
  };

  const handleLogin = async () => {
    const userData = { email: value, password };
    setLoading({ ...loading, login: true }); // Start loading

    try {
      const response = await dispatch(
        loginUser({ dynamicParams: {}, bodyData: userData })
      );

      if (
        response.payload.statusCode === 200 ||
        response.payload.statusCode === 201
      ) {
        setLoading({ ...loading, login: false }); // Stop loading
        navigate("/jobs");
        dispatch(getProfile());
      } else if (response.payload.message === "Verify your email!") {
        setLoading({ ...loading, login: false }); // Stop loading
        setState("verify");
        dispatch(resendEmail(userData.email));
      }
    } catch (error) {
      setLoading({ ...loading, login: false }); // Stop loading
      console.error("Login failed:", error);
    }
    setLoading({ ...loading, login: false }); // Stop loading
  };
  console.log("im loading", loading);
  const handleForgetPassword = async () => {
    setLoading({ ...loading, forgetPassword: true }); // Start loading for forget password
    try {
      dispatch(
        forgetPassword({
          dynamicParams: { email: value },
          bodyData: { email: value },
        })
      );
    } catch (error) {
      console.error("Forget password failed:", error);
    } finally {
      setLoading({ ...loading, forgetPassword: false }); // Stop loading for forget password
    }
  };

  const handleResendEmail = async () => {
    setShowResendButton(false);
    setLoading({ ...loading, resendEmail: true }); // Start loading for resend email
    console.log(value);
    try {
      const response = await dispatch(
        resendEmail({
          dynamicParams: { email: value },
          bodyData: {},
        })
      );
      console.log("response here", response);
    } catch (error) {
      console.error("Resend email failed:", error);
    } finally {
      setLoading({ ...loading, resendEmail: false }); // Stop loading for resend email
    }
  };

  useEffect(() => {
    let intervalId;

    // Start the countdown timer
    if (!showResendButton) {
      intervalId = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            // If timer reaches 0, show the resend button again
            clearInterval(intervalId);
            setShowResendButton(true);
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [showResendButton]);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setState("loggedIn");
    }
  }, []);
  return (
    <Stack
      className="auth-back"
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Grow in={true}>
        <Stack direction="row" justifyContent="center">
          {state === "login" ? (
            <div className="center-wrap">
              <div
                className="flex items-center justify-center text-gray-300 cursor-pointer mx-auto gap-x-1 my-4"
                onClick={() => navigate(`/`)}
              >
                <MdHome className="text-xl " />
                <p className="text-lg hover:underline ">KOC Freelancing</p>
              </div>
              <h4 className="auth-title">Giriş Yap</h4>
              <Stack direction="row" justifyContent="center">
                <Stack sx={{ width: "80%" }}>
                  <StartAodornmentField
                    value={value}
                    handleChange={handleChange}
                    Icon={<MarkunreadIcon sx={{ color: "#ffeba7" }} />}
                    helperText={""}
                    placeHolder="Email Address"
                  />
                  <PasswordField
                    value={password}
                    handleChange={handlePwd}
                    helperText={""}
                    error={false}
                    placeHolder="Password"
                  />
                </Stack>
              </Stack>
              <Stack direction="row" justifyContent="end">
                <div
                  className="auth-reset cursor-pointer"
                  onClick={() => handleClick("reset")}
                >
                  Şifrenizi mi unuttunuz?
                </div>
              </Stack>
              <Stack direction="row" justifyContent="center">
                {loading.login ? (
                  <div className="btn !cursor-context-menu !px-16 hover:bg-[#ffeaa7af]">
                    <div className="loaderAuth mx-auto"></div>{" "}
                  </div>
                ) : (
                  <button className="btn " onClick={handleLogin}>
                    <p>GİRİŞ YAP</p>{" "}
                  </button>
                )}
              </Stack>
              <Stack direction="row" justifyContent="center" alignSelf="center">
                <Typography sx={{ color: "#c4c3ca" }}>
                  Hesabınız yok mu?
                </Typography>
                <Link to="/auth/signup" className="auth-change-btn">
                  Sign Up
                </Link>
              </Stack>
            </div>
          ) : (
            state === "verify" && (
              <div className="reset-wrap">
                <Stack
                  direction="row"
                  justifyContent="start"
                  alignItems="center"
                >
                  <IconButton
                    onClick={() => handleClick("login")}
                    sx={{ marginLeft: "20px" }}
                  >
                    <ArrowBackIosNewIcon sx={{ color: "grey" }} />
                  </IconButton>
                  <h4 className="auth-title">Verify Your Email</h4>
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
                    {showResendButton ? (
                      <span
                        className="auth-change-btn cursor-pointer"
                        onClick={handleResendEmail}
                      >
                        Resend email.
                      </span>
                    ) : loading.resendEmail ? (
                      "..."
                    ) : (
                      <span> {`Resend email in ${timer} seconds.`}</span>
                    )}
                  </Typography>
                </Stack>
              </div>
            )
          )}{" "}
          {/* Closing brace for first ternary condition */}
          {state === "reset" ? (
            <div className="reset-wrap">
              <Stack
                direction="row"
                display="flex"
                justifyContent="start"
                alignItems="center"
                mb={4}
              >
                <IconButton
                  onClick={() => handleClick("login")}
                  sx={{ marginLeft: "20px" }}
                >
                  <ArrowBackIosNewIcon sx={{ color: "grey" }} />
                </IconButton>
                <h4 className="text-xl ">Şifrenizi sıfırlayın</h4>
              </Stack>
              <Stack direction="row" justifyContent="center">
                <Stack sx={{ width: "80%" }}>
                  <StartAodornmentField
                    value={value}
                    handleChange={handleChange}
                    Icon={<MarkunreadIcon sx={{ color: "#ffeba7" }} />}
                    helperText={""}
                    placeHolder="Email or Username"
                  />
                </Stack>
              </Stack>
              <Stack direction="row" justifyContent="center">
                {loading.forgetPassword ? (
                  <div className="btn !cursor-context-menu !px-16 hover:bg-[#ffeaa7af]">
                    <div className="loaderAuth mx-auto"></div>{" "}
                  </div>
                ) : (
                  <button className="btn" onClick={handleForgetPassword}>
                    Sonraki
                  </button>
                )}
              </Stack>
            </div>
          ) : (
            state === "loggedIn" && (
              <div className="reset-wrap">
                <Stack
                  direction="row"
                  justifyContent="start"
                  alignItems="center"
                >
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
            )
          )}
        </Stack>
      </Grow>
    </Stack>
  );
};

export default LoginPage;
