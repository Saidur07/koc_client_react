"use client";

import PasswordField from "../../components/form/passwordField";
import StartAodornmentField from "../../components/form/startAodornmentField";
import TextField from "../../components/form/textField";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import MarkunreadIcon from "@mui/icons-material/Markunread";
import { Stack, Typography } from "@mui/material";
import Grow from "@mui/material/Grow";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const SignUpComp = () => {
  const [value, setValue] = useState("");
  const [password, setPassword] = useState("");
  const handleChange = (value) => {
    setValue(value);
  };
  const handlePwd = (value) => {
    setPassword(value);
  };
  return (
    <div className="center-wrap">
      <h4 className="auth-title">Giriş Yap</h4>
      <Stack direction="row" justifyContent="center">
        <Stack sx={{ width: "80%" }}>
          <StartAodornmentField
            value={value}
            handleChange={handleChange}
            Icon={<MarkunreadIcon sx={{ color: "#ffeba7" }} />}
            helperText={""}
            placeHolder="Email or Username"
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
        <Typography sx={{ color: "#c4c3ca" }}>Hesabınız yok mu?</Typography>
        <Link to="/auth/signup" className="auth-change-btn">
          Sign Up
        </Link>
      </Stack>
    </div>
  );
};

export default SignUpComp;
