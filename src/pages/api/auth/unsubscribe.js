export default async function unsubscribe(req, res) {
  if (req.method === "POST") {
    try {
      const { email, subscriptionId } = req.body;

      // use subscriptionId to cancel stripe subscription

      // use email to find user and update subscription status

      // update token to show status as inactive. This might be hard
    } catch (error) {
      res.status(500).send({ error });
    }
  } else {
    res
      .status(500)
      .send({ error: "Invalid method, only POST requests permitted." });
  }
}
