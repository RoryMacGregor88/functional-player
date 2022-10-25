import * as Yup from "yup";

import {
  EMAIL_REQUIRED_MESSAGE,
  EMAIL_INVALID_MESSAGE,
  USERNAME_REQUIRED_MESSAGE,
  PASSWORD_REQUIRED_MESSAGE,
  NO_PASSWORD_MATCH_MESSAGE,
  PASSWORD_MIN_LENGTH_MESSAGE,
  PASSWORD_CONFIRM_REQUIRED_MESSAGE,
} from "@/src/utils";

// TODO: move this shit into each form, this is stupid

const loginFormSchema = Yup.object().shape({
  email: Yup.string()
    .email(EMAIL_INVALID_MESSAGE)
    .required(EMAIL_REQUIRED_MESSAGE),
  password: Yup.string().required(PASSWORD_REQUIRED_MESSAGE),
});

const registerFormSchema = Yup.object().shape({
  email: Yup.string()
    .email(EMAIL_INVALID_MESSAGE)
    .required(EMAIL_REQUIRED_MESSAGE),
  username: Yup.string().required(USERNAME_REQUIRED_MESSAGE),
  password: Yup.string()
    .required(PASSWORD_REQUIRED_MESSAGE)
    .min(5, PASSWORD_MIN_LENGTH_MESSAGE),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], NO_PASSWORD_MATCH_MESSAGE)
    .required(PASSWORD_CONFIRM_REQUIRED_MESSAGE),
});

export { loginFormSchema, registerFormSchema };
