import { useState } from "react";

import { Grid, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { TextField, IconButton } from "..";
import { PASSWORD_MIN, PASSWORD_MAX } from "src/constants";

/**
 * @param {{
 *  errors: object
 *  register: function
 * }} props
 */
const EmailField = ({ errors, register }) => (
  <Grid
    item
    component={TextField}
    variant="outlined"
    label="Email"
    type="email"
    aria-describedby="email"
    error={!!errors.email}
    helperText={errors.email?.message}
    {...register("email", {
      required: "Email address is required",
    })}
    autoFocus
  />
);

/**
 * @param {{
 *  errors: object
 *  register: function
 * }} props
 */
const UsernameField = ({ errors, register }) => (
  <Grid
    item
    component={TextField}
    variant="outlined"
    label="Username"
    // TODO: check type is right
    type="input"
    aria-describedby="username"
    error={!!errors.username}
    helperText={errors.username?.message}
    {...register("username", {
      required: "Username is required",
    })}
  />
);

/**
 * @param {{
 *  errors: object
 *  register: function
 * }} props
 */
const PasswordField = ({ errors, register }) => {
  const [showPassword, setShowPassword] = useState(false);

  // TODO: need to make this re-usable with confirm password

  // TODO: this is broke, negative margin -12px being implemented somewhere
  const iconStyles = { marginRight: "1rem", color: "palette.primary.main" };

  return (
    <Grid
      item
      component={TextField}
      variant="outlined"
      label="Password"
      type={showPassword ? "input" : "password"}
      aria-describedby="password"
      error={!!errors.password}
      helperText={errors.password?.message}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? (
                // TODO: which way around?
                <Visibility sx={iconStyles} />
              ) : (
                <VisibilityOff sx={iconStyles} />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...register("password", {
        required: "Password is required",
        minLength: {
          value: PASSWORD_MIN,
          message: `Password is too short (minimum ${PASSWORD_MIN} characters)`,
        },
        maxLength: {
          value: PASSWORD_MAX,
          message: `Password is too long (maximum ${PASSWORD_MAX} characters)`,
        },
      })}
    />
  );
};

/**
 * @param {{
 *  errors: object
 *  register: function
 * }} props
 */
const ConfirmPasswordField = ({ errors, register }) => (
  <Grid
    item
    component={TextField}
    variant="outlined"
    label="Confirm Password"
    type="password"
    aria-describedby="confirmPassword"
    error={!!errors.confirmPassword}
    helperText={errors.confirmPassword?.message}
    {...register("confirmPassword", {
      required: "Password confirmation is required",
      minLength: PASSWORD_MIN,
      maxLength: PASSWORD_MAX,
    })}
  />
);

export { UsernameField, EmailField, PasswordField, ConfirmPasswordField };
