import { useState } from "react";

import { InputAdornment } from "@mui/material";

import {
  TextField,
  IconButton,
  VisibilityIcon,
  VisibilityOffIcon,
} from "@/src/components";

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
    {...register("email")}
    autoFocus
  />
);

/**
 * @param {{
 *  errors: object
 *  register: function
 * }} props
 */
const ConfirmEmailField = ({ errors, register }) => (
  <TextField
    variant="outlined"
    label="Confirm email"
    id="confirmEmail"
    name="confirmEmail"
    type="email"
    aria-describedby="confirmEmail"
    error={!!errors.confirmEmail}
    helperText={errors.confirmEmail?.message}
    {...register("confirmEmail")}
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
    {...register("username")}
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
const PasswordField = ({ errors, register, label, name }) => {
  const [showPassword, setShowPassword] = useState(false);

  // TODO: this is broke, negative margin -12px being implemented somewhere
  const iconStyles = { marginRight: "1rem", color: "palette.primary.main" };

  return (
    <TextField
      variant="outlined"
      label={label}
      id={name}
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
                <VisibilityIcon sx={iconStyles} />
              ) : (
                <VisibilityOffIcon sx={iconStyles} />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...register(name)}
    />
  );
};

export { UsernameField, EmailField, ConfirmEmailField, PasswordField };
