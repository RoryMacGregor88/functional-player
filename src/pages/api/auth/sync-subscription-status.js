import { withIronSessionApiRoute } from "iron-session/next";

import { syncStripeAndDb, sessionOptions, logServerError } from "lib";

import {
  HTTP_METHOD_ERROR_MESSAGE,
  DEFAULT_TOKEN_FORBIDDEN_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
} from "@/src/utils";

async function syncSubscriptionStatus(req, res) {
  if (req.method === "POST") {
    if (req.session.user?.email !== req.body.email) {
      return res
        .status(403)
        .send({ error: { message: DEFAULT_TOKEN_FORBIDDEN_MESSAGE } });
    }
    try {
      const {
        email,
        subscriptionStatus: currentSubscriptionStatus,
        subscriptionId,
      } = req.body;

      const { error, subscriptionStatus } = await syncStripeAndDb(
        email,
        currentSubscriptionStatus,
        subscriptionId
      );

      if (!!error) {
        return res.status(500).send(error);
      }

      const resUser = {
        ...req.session.user,
        subscriptionStatus,
      };

      req.session.user = resUser;
      await req.session.save();

      return res.status(200).json({ resUser });
    } catch (error) {
      logServerError("syncSubscriptionStatus", error);
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

export default withIronSessionApiRoute(syncSubscriptionStatus, sessionOptions);
