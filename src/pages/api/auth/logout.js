import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";

import {
  HTTP_METHOD_ERROR_MESSAGE,
  DEFAULT_TOKEN_FORBIDDEN_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
} from "@/src/utils";

function logout(req, res) {
  if (req.method === "POST") {
    if (req.session.user?.email !== req.body.email) {
      return res
        .status(403)
        .send({ error: { message: DEFAULT_TOKEN_FORBIDDEN_MESSAGE } });
    }
    try {
      req.session.destroy();
      return res.status(200).send({ resUser: {} });
    } catch (error) {
      console.log("ERROR in logout: ", error);
      return res
        .status(500)
        .send({ error: { message: DEFAULT_ERROR_MESSAGE } });
    }
  } else {
    return res
      .status(403)
      .send({ error: { message: HTTP_METHOD_ERROR_MESSAGE } });
  }
}

export default withIronSessionApiRoute(logout, sessionOptions);
