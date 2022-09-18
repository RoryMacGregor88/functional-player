import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";

import { HTTP_METHOD_ERROR_MESSAGE } from "@/src/utils";

function logout(req, res) {
  if (req.method === "POST") {
    try {
      req.session.destroy();
      return res.status(200).send({ ok: true, user: null });
    } catch (error) {
      console.log("ERROR in logout: ", error);
      return res.status(500).send({ error });
    }
  } else {
    return res.status(500).send({ error: HTTP_METHOD_ERROR_MESSAGE });
  }
}

export default withIronSessionApiRoute(logout, sessionOptions);
