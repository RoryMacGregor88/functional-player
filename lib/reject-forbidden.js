export default function rejectForbidden(res, message) {
  return res.status(403).send({ error: { message } });
}
