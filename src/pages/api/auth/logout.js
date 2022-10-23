import { withIronSessionApiRoute } from "iron-session/next";
import {
  sessionOptions,
  logServerError,
  handleForbidden,
  handleServerError,
} from "lib";
import {
  HTTP_METHOD_ERROR_MESSAGE,
  DEFAULT_TOKEN_FORBIDDEN_MESSAGE,
} from "@/src/utils";

async function logout(req, res) {
  if (req.method !== "POST") {
    return handleForbidden(res, HTTP_METHOD_ERROR_MESSAGE);
  } else {
    if (req.session.user?.email !== req.body.email) {
      return handleForbidden(res, DEFAULT_TOKEN_FORBIDDEN_MESSAGE);
    }
    try {
      req.session.destroy();
      return res.status(200).json({ resUser: null });
    } catch (error) {
      await logServerError("logout", error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(logout, sessionOptions);
