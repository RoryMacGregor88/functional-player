import { withIronSessionApiRoute } from "iron-session/next";
import {
  sessionOptions,
  handleForbidden,
  handleServerError,
  logServerError,
} from "lib";

async function authenticateToken(req, res) {
  if (req.method !== "GET") {
    return handleForbidden(res, "Invalid method, only GET requests permitted.");
  } else {
    try {
      // if no session user found, user is logged out, return null value
      const resUser = req.session.user ?? null;
      return res.status(200).json({ resUser });
    } catch (error) {
      await logServerError("authenticateToken", error);
      return handleServerError(res);
    }
  }
}

export default withIronSessionApiRoute(authenticateToken, sessionOptions);
