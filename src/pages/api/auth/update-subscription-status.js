import { withIronSessionApiRoute } from "iron-session/next";

import { syncStripeAndDb } from "lib/syncStripeAndDb";

import { sessionOptions } from "lib/session";

import {
  HTTP_METHOD_ERROR_MESSAGE,
  DEFAULT_TOKEN_FORBIDDEN_MESSAGE,
} from "@/src/utils";

async function updateSubscriptionStatus(req, res) {
  if (req.method === "POST") {
    if (req.session.user?.email !== req.body.email) {
      return res.status(403).send({ error: DEFAULT_TOKEN_FORBIDDEN_MESSAGE });
    }
    try {
      const { email, subscriptionStatus, subscriptionId } = req.body;

      const syncedStatus = await syncStripeAndDb(
        email,
        subscriptionStatus,
        subscriptionId
      );

      const updatedUser = {
        ...req.session.user,
        subscriptionStatus: syncedStatus,
      };

      req.session.user = updatedUser;

      return res.status(200).send({ ok: true, user: updatedUser });
    } catch (error) {
      console.log("ERROR in updateSubscriptionStatus: ", error);
      return res.status(500).send({ error });
    }
  } else {
    return res.status(500).send({ error: HTTP_METHOD_ERROR_MESSAGE });
  }
}

export default withIronSessionApiRoute(
  updateSubscriptionStatus,
  sessionOptions
);
