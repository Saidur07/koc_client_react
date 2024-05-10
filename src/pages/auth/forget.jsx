import React from "react";
import Grow from "@mui/material/Grow";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetPassword } from "../../axios/axios";
import toast from "react-hot-toast";
import { Stack, Typography } from "@mui/material";
import PasswordField from "../../components/form/passwordField";

const LoginPage = () => {
  const dispatch = useDispatch();
  const [state, setState] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState(false);
  const [queryToken, setQueryToken] = React.useState("");
  const [loading, setLoading] = React.useState({
    resetPassword: false,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  React.useEffect(() => {
    setQueryToken(token);
    if (token !== undefined) {
      setState("reset");
    }
  }, [token]);
  const handlePwd = (value) => {
    setPassword(value);
    if (value.length < 6) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };
  const handleConfirmPwd = (value) => {
    setConfirmPassword(value);
  };
  const handleReset = async () => {
    const passwordData = {
      password,
      confirmPassword,
    };
    setLoading({ ...loading, resetPassword: true }); // Start loading for reset password
    try {
      const response = await dispatch(
        resetPassword({
          dynamicParams: { token: queryToken },
          bodyData: passwordData,
        })
      );
      console.log("response here", response);
      if (
        response.payload.statusCode === 200 ||
        response.payload.statusCode === 201
      ) {
        navigate("/auth/login");
      }
    } catch (error) {
      console.error("Reset password failed:", error);
    } finally {
      setLoading({ ...loading, resetPassword: false }); // Stop loading for reset password
    }
  };

  return (
    <Stack
      className="auth-back"
      direction="row"
      justifyContent="center"
      alignItems="center"
    >
      <Grow in={true}>
        <Stack direction="row" justifyContent="center">
          {state === "reset" && (
            <div className="center-wrap">
              <h4 className="auth-title mb-4">Reset Your Password</h4>
              <Stack direction="row" justifyContent="center">
                <Stack sx={{ width: "80%" }}>
                  <PasswordField
                    value={password}
                    handleChange={handlePwd}
                    helperText={""}
                    error={passwordError}
                    placeHolder="Password"
                  />
                  <PasswordField
                    value={confirmPassword}
                    handleChange={handleConfirmPwd}
                    helperText={""}
                    error={false}
                    placeHolder="Re-enter Password"
                  />
                </Stack>
              </Stack>
              <Stack direction="row" justifyContent="center">
                {loading.resetPassword ? (
                  <div className="btn !cursor-context-menu !px-16 hover:bg-[#ffeaa7af]">
                    <div className="loaderAuth mx-auto"></div>{" "}
                  </div>
                ) : (
                  <div className="btn" onClick={handleReset}>
                    Reset Password
                  </div>
                )}
              </Stack>
            </div>
          )}
        </Stack>
      </Grow>
    </Stack>
  );
};

export default LoginPage;
