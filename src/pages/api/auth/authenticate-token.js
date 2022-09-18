import { withIronSessionApiRoute } from "iron-session/next";

import { sessionOptions } from "lib/session";

async function authenticateToken(req, res) {
  if (req.method === "GET") {
    try {
      const user = req.session.user ?? null;
      return res.status(200).json({ user });
    } catch (error) {
      console.log("ERROR in user: ", error);
      return res.status(500).send({ error });
    }
  } else {
    return res
      .status(500)
      .send({ error: "Invalid method, only GET and POST requests permitted." });
  }
}

export default withIronSessionApiRoute(authenticateToken, sessionOptions);
