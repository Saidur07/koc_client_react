import LockOpenIcon from "@mui/icons-material/LockOpen";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import React from "react";

const PasswordField = ({
  value,
  handleChange,
  error,
  helperText,
  placeHolder,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={{ width: "100%" }} variant="outlined">
      <OutlinedInput
        id="outlined-adornment-weight"
        type={showPassword ? "text" : "password"}
        startAdornment={
          <InputAdornment position="start">
            <LockOpenIcon sx={{ color: "#ffeba7" }} />
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? (
                <VisibilityOff sx={{ color: "#ffeba7" }} />
              ) : (
                <Visibility sx={{ color: "#ffeba7" }} />
              )}
            </IconButton>
          </InputAdornment>
        }
        aria-describedby="outlined-weight-helper-text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        inputProps={{
          "aria-label": "weight",
        }}
        placeholder={placeHolder}
        sx={{
          m: 1,
          backgroundColor: "#1f2029",
          color: "#c4c3ca",
          fontSize: "15px",
          border: error ? "1px solid rgb(220,38,38)" : "none",
          outline: "none !important",
          fontFamily: "'Poppins', sans-serif",
        }}
        className="outline-field"
      />
      {error && (
        <FormHelperText
          id="outlined-weight-helper-text"
          sx={{ color: "rgb(220,38,38)" }}
        >
          Password must be at least 6 characters long.
        </FormHelperText>
      )}
      {!error && (
        <FormHelperText id="outlined-weight-helper-text">
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default PasswordField;
