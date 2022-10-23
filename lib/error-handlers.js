import { DEFAULT_ERROR_MESSAGE } from "@/src/utils";

function handleForbidden(res, message) {
  return res.status(403).json({ error: { message } });
}

function handleServerError(res) {
  return res.status(500).json({ error: { message: DEFAULT_ERROR_MESSAGE } });
}

async function logServerError(handlerName, error) {
  console.log(`SERVER ERROR in ${handlerName}: `, error);
}

export { handleForbidden, handleServerError, logServerError };
