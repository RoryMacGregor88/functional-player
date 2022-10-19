import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { DEFAULT_ERROR_MESSAGE } from "@/src/utils";

async function authenticateToken(req, res) {
  if (req.method === "GET") {
    try {
      const resUser = req.session.user ?? null;
      return res.status(200).json({ resUser });
    } catch (error) {
      console.log("ERROR in authenticateToken: ", error);
      return res
        .status(500)
        .send({ error: { message: DEFAULT_ERROR_MESSAGE } });
    }
  } else {
    return res.status(403).send({
      error: { message: "Invalid method, only GET requests permitted." },
    });
  }
}

export default withIronSessionApiRoute(authenticateToken, sessionOptions);
