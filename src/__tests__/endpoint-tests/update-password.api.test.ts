import {
  SESSION_ERROR_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
  INCORRECT_PASSWORD_MESSAGE,
  EMAIL_NOT_FOUND_MESSAGE,
} from '@/src/utils/constants';

import updatePassword from '@/src/pages/api/auth/update-password';

let json = null,
  status = null;

jest.mock('iron-session/next', () => ({
  withIronSessionApiRoute: (cb) => async (req, res) => cb(req, res),
}));

jest.mock('bcryptjs', () => ({
  compare: (p1, p2) => p1 === p2,
  hash: () => {},
}));

jest.mock('@/lib', () => ({
  sanitizeBody: (b) => b,
  connectToDatabase: jest.fn().mockImplementation(() => ({
    db: {
      collection: () => ({
        findOne: ({ email }) => {
          if (email === 'error@test.com') {
            throw new Error('test-error');
          } else if (email === 'notfound@test.com') {
            return null;
          } else if (email === 'success@test.com') {
            const testUser = { password: '12345' };
            return testUser;
          }
        },
        updateOne: () => {},
      }),
    },
  })),
  logServerError: async (handler, error) => {
    console.log(`ERROR in ${handler}: ${error}`);
  },
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

describe('updatePassword endpoint', () => {
  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
  });

  it('updates password', async () => {
    const email = 'success@test.com',
      req = {
        method: 'POST',
        body: { email, currentPassword: '12345', newPassword: '678910' },
        session: { user: { email } },
      },
      res = { status };

    await updatePassword(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      ok: true,
    });
  });

  it('handles user not found', async () => {
    const email = 'notfound@test.com',
      req = {
        method: 'POST',
        body: { email, currentPassword: '12345', newPassword: '678910' },
        session: { user: { email } },
      },
      res = { status };

    await updatePassword(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      error: { message: EMAIL_NOT_FOUND_MESSAGE },
    });
  });

  it('handles incorrect password', async () => {
    const email = 'success@test.com',
      req = {
        method: 'POST',
        body: { email, currentPassword: '678910', newPassword: '12345' },
        session: { user: { email } },
      },
      res = { status };

    await updatePassword(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      error: { message: INCORRECT_PASSWORD_MESSAGE },
    });
  });

  it('handles http method forbidden', async () => {
    const req = { method: 'GET' },
      res = { status };

    await updatePassword(req, res);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      error: { message: HTTP_METHOD_ERROR_MESSAGE },
    });
  });

  it('handles session forbidden', async () => {
    const req = {
        method: 'POST',
        body: { email: 'success@test.com' },
        session: { user: {} },
      },
      res = { status };

    await updatePassword(req, res);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      error: { message: SESSION_ERROR_MESSAGE },
    });
  });

  it('handles error', async () => {
    const email = 'error@test.com',
      req = {
        method: 'POST',
        body: { email },
        session: { user: { email } },
      },
      res = { status };

    await updatePassword(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: { message: DEFAULT_ERROR_MESSAGE },
    });
  });
});
