import { NextApiResponse } from 'next';

import { DEFAULT_ERROR_MESSAGE } from '@/src/utils/constants';

function handleForbidden(res: NextApiResponse, message: string): void {
  return res.status(403).json({ error: { message } });
}

function handleServerError(res: NextApiResponse): void {
  return res.status(500).json({ error: { message: DEFAULT_ERROR_MESSAGE } });
}

async function logServerError(
  handlerName: string,
  error: Error
): Promise<void> {
  console.log(`SERVER ERROR in ${handlerName}: `, error);
}

export { handleForbidden, handleServerError, logServerError };
