import { NextApiRequest, NextApiResponse } from 'next';

import nodemailer from 'nodemailer';

import {
  connectToDatabase,
  handleForbidden,
  handleServerError,
  logServerError,
  sanitizeBody,
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
      const { email, body } = sanitizeBody(req.body);
      const { db } = await connectToDatabase();

      const result = await db.collection<DbUser>(USERS).findOne({ email });

      let resultMetadata = {};

      if (result) {
        const { username, customerId, subscriptionId, subscriptionStatus } =
          result;

        resultMetadata = {
          username,
          customerId,
          subscriptionId,
          subscriptionStatus,
        };
      }

      const metadata = {
        email,
        ...resultMetadata,
      };

      const formattedMetadata = Object.entries(metadata).reduce(
        (acc, [key, value]) =>
          acc + `<strong>${key.toUpperCase()}: </strong><p>${value}</p><br/>`,
        ''
      );

      const html = `
        <div>
          <p>You have been contacted by ${email}</p>
          <br/>
          <p>Registered: ${!!result ? 'YES' : ' NO'}</p>
          <br/>
          ${formattedMetadata}
          <br/>
          <p>The following message was attached: </p>
          <br/>
          <p>${body}</p>
        </div>
      `;

      const hostEmail = process.env.HOST_EMAIL,
        password = process.env.HOST_EMAIL_PASSWORD;

      const transporter = nodemailer.createTransport({
        host: 'smtp.outlook.com',
        auth: {
          user: hostEmail,
          pass: password,
        },
      });

      const data = {
        from: hostEmail,
        to: hostEmail,
        subject: `Contact message from ${email}.`,
        html,
      };

      await transporter.sendMail(data);

      return res.status(200).json({ ok: true });
    } catch (error) {
      await logServerError('contact', error);
      return handleServerError(res);
    }
  }
}

export default contact;
