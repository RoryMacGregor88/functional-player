import { NextApiRequest, NextApiResponse } from 'next';

import nodemailer from 'nodemailer';

import { hash } from 'bcryptjs';

import {
  connectToDatabase,
  handleServerError,
  handleForbidden,
  logServerError,
} from '@/lib';

import { generateTempPassword } from '@/src/utils';

import {
  USERS,
  HTTP_METHOD_ERROR_MESSAGE,
  EMAIL_NOT_FOUND_MESSAGE,
} from '@/src/utils/constants';

import { DbUser } from '@/src/utils/interfaces';

export default async function resetPassword(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== 'POST') {
    return handleForbidden(res, HTTP_METHOD_ERROR_MESSAGE);
  } else {
    try {
      const { email } = req.body;
      const { db } = await connectToDatabase();

      const result = await db.collection<DbUser>(USERS).findOne({ email });

      if (!result) {
        return res.status(400).json({
          error: {
            message: EMAIL_NOT_FOUND_MESSAGE,
          },
        });
      }

      const tempPassword = generateTempPassword();

      await db
        .collection(USERS)
        .findOneAndUpdate(
          { email },
          { $set: { password: await hash(tempPassword, 12) } }
        );

      const html = `
        <div>
          <p>Hello, ${result.username}.</p>
          <br/>
          <p>Your password has been reset to: <strong>${tempPassword}</strong><p>
          <br/>
          <p>Please use it to log in, then change your password from the <strong>Accounts</strong> tab.</p>
          <br/>
          <p>Kind regards,</p>
          <br/>
          <p>FunctionalPlayer</p>
        </div>
      `;

      // TODO: fix env variables
      const hostEmail = process.env.HOST_EMAIL;

      const transporter = nodemailer.createTransport({
        host: 'smtp.outlook.com',
        auth: {
          user: hostEmail,
          pass: process.env.HOST_EMAIL_PASSWORD,
        },
      });

      const data = {
        from: hostEmail,
        to: email,
        subject: 'Password Reset',
        html,
      };

      await transporter.sendMail(data);

      return res.status(200).json({ ok: true });
    } catch (error) {
      await logServerError('resetEmail', error);
      return handleServerError(res);
    }
  }
}
