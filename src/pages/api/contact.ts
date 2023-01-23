import { NextApiRequest, NextApiResponse } from 'next';

import {
  connectToDatabase,
  handleForbidden,
  handleServerError,
  logServerError,
} from '@/lib';

import { DbUser } from '@/src/utils/interfaces';

import { USERS, HTTP_METHOD_ERROR_MESSAGE } from '@/src/utils/constants';

async function contact(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    return handleForbidden(res, HTTP_METHOD_ERROR_MESSAGE);
  } else {
    try {
      const { email, body } = req.body;
      const { db } = await connectToDatabase();

      const result = await db.collection<DbUser>(USERS).findOne({ email });

      const userMetadata = !!result
        ? {
            username: result.username,
            customerId: result.customerId,
            subscriptionId: result.subscriptionId,
            subscriptionStatus: result.subscriptionStatus,
          }
        : {};

      const metadata = {
        email,
        ...userMetadata,
        body,
      };

      console.log(
        `You have been contacted by ${email}, who is${
          !!result ? '' : ' not'
        } registered with the app: `
      );
      console.log('Metadata: ', metadata);

      // TODO: flesh out email functionality

      return res.status(200).json({ ok: true });
    } catch (error) {
      await logServerError('lastWatched', error);
      return handleServerError(res);
    }
  }
}

export default contact;
