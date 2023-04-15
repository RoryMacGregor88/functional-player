import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
  EMAIL_NOT_FOUND_MESSAGE,
} from '@/src/utils/constants';

import resetPassword from '@/src/pages/api/auth/reset-password';

let json = null,
  status = null;

jest.mock('bcryptjs', () => ({
  hash: () => {},
}));

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockImplementation(() => ({
    sendMail: () => {},
  })),
}));

jest.mock('@/lib', () => ({
  sanitizeBody: (b) => b,
  connectToDatabase: jest.fn().mockImplementation(() => ({
    db: {
      collection: () => ({
        findOne: ({ email }) => {
          if (email === 'error@test.com') {
            throw new Error('test-error');
          } else if (email === 'success@test.com') {
            const testUser = { password: '12345' };
            return testUser;
          } else if (email === 'nouser@test.com') {
            return null;
          }
        },
        findOneAndUpdate: () => {
          true;
        },
      }),
    },
  })),
  logServerError: () => {},
  handleForbidden: jest
    .fn()
    .mockImplementation((res, message) =>
      res.status(403).json({ error: { message } })
    ),
  handleServerError: jest
    .fn()
    .mockImplementation((res) =>
      res.status(500).json({ error: { message: DEFAULT_ERROR_MESSAGE } })
    ),
}));

describe('resetPassword endpoint', () => {
  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
  });

  it('resets password', async () => {
    const email = 'success@test.com',
      req = {
        method: 'POST',
        session: { user: { email } },
        body: { email },
      },
      res = { status };

    await resetPassword(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ ok: true });
  });

  it('handles no user found', async () => {
    const email = 'nouser@test.com',
      req = {
        method: 'POST',
        session: { user: { email } },
        body: { email },
      },
      res = { status };

    await resetPassword(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      error: { message: EMAIL_NOT_FOUND_MESSAGE },
    });
  });

  it('handles http method forbidden', async () => {
    const req = { method: 'GET' },
      res = { status };

    await resetPassword(req, res);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      error: { message: HTTP_METHOD_ERROR_MESSAGE },
    });
  });

  it('handles error', async () => {
    const email = 'error@test.com',
      req = {
        method: 'POST',
        session: { user: { email } },
        body: { email },
      },
      res = { status };

    await resetPassword(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: { message: DEFAULT_ERROR_MESSAGE },
    });
  });
});
