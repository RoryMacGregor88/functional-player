import { useState } from "react";

import { InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import { TextField, IconButton } from "..";
import { PASSWORD_MIN, PASSWORD_MAX } from "@/src/utils";

/**
 * @param {{
 *  errors: object
 *  register: function
 * }} props
 */
const EmailField = ({ errors, register }) => (
  <TextField
    variant="outlined"
    label="Email"
    id="email"
    name="email"
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
  <TextField
    variant="outlined"
    label="Username"
    id="username"
    name="username"
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
 *  label: string
 *  name: string
 *  validate?: boolean
 * }} props
 */
const PasswordField = ({ errors, register, label, name, validate = false }) => {
  const [showPassword, setShowPassword] = useState(false);

  // TODO: this is broke, negative margin -12px being implemented somewhere
  const iconStyles = { marginRight: "1rem", color: "palette.primary.main" };

  const validation = validate
    ? {
        minLength: {
          value: PASSWORD_MIN,
          message: `Password is too short (minimum ${PASSWORD_MIN} characters)`,
        },
        maxLength: {
          value: PASSWORD_MAX,
          message: `Password is too long (maximum ${PASSWORD_MAX} characters)`,
        },
      }
    : {};

  return (
    <TextField
      variant="outlined"
      label={label}
      id={name}
      data-testid="test-password"
      type={showPassword ? "input" : "password"}
      aria-describedby={name}
      error={!!errors[name]}
      helperText={errors[name]?.message}
      InputProps={{
        role: "textbox",
        "aria-label": label,
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
      {...register(name, {
        required: `${label} is required`,
        ...validation,
      })}
    />
  );
};

export { UsernameField, EmailField, PasswordField };
