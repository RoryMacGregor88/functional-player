import { withIronSessionApiRoute } from "iron-session/next";

import { sessionOptions } from "lib/session";

async function user(req, res) {
  if (req.method === "GET") {
    try {
      const user = req.session.user;
      return res.status(200).json(!!user ? { user } : { noSession: true });
    } catch (error) {
      return res.status(500).send({ error });
    }
  } else {
    // TODO: is 500 correct status? It's a successful request
    return res
      .status(500)
      .send({ error: "Invalid method, only GET requests permitted." });
  }
}

export default withIronSessionApiRoute(user, sessionOptions);
