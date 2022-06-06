import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";

function logout(req, res) {
  if (req.method === "POST") {
    try {
      req.session.destroy();
      return res.status(200).send({ ok: true });
    } catch (error) {
      return res.status(500).send({ error });
    }
  } else {
    return res
      .status(500)
      .send({ error: "Invalid method, only POST requests permitted." });
  }
}

export default withIronSessionApiRoute(logout, sessionOptions);
