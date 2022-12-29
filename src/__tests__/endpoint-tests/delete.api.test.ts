import {
  TOKEN_ERROR_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
  EMAIL_NOT_FOUND_MESSAGE,
  INCORRECT_PASSWORD_MESSAGE,
} from '@/src/utils/constants';

import deleteAccount from '@/src/pages/api/auth/delete';

let json = null,
  status = null;

jest.mock('stripe', () =>
  jest.fn().mockImplementation(() => ({ customers: { del: () => {} } }))
);

jest.mock('iron-session/next', () => ({
  withIronSessionApiRoute: (cb) => async (req, res) => cb(req, res),
}));

jest.mock('bcryptjs', () => ({
  compare: (p1, p2) => p1 === p2,
}));

jest.mock('@/lib', () => ({
  connectToDatabase: jest.fn().mockImplementation(() => ({
    db: {
      collection: () => ({
        findOne: ({ email }) => {
          if (email === 'error@test.com') {
            throw new Error();
          } else if (email === 'success@test.com') {
            const testUser = { password: '12345' };
            return testUser;
          } else if (email === 'nouser@test.com') {
            return null;
          }
        },
        deleteOne: () => {},
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

describe('delete endpoint', () => {
  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
  });

  it('deletes user', async () => {
    const email = 'success@test.com',
      req = {
        method: 'POST',
        body: { email, password: '12345' },
        session: { user: { email }, destroy: () => {} },
      },
      res = { status };

    await deleteAccount(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ resUser: null });
  });

  it('handles no user found', async () => {
    const email = 'nouser@test.com',
      req = {
        method: 'POST',
        body: { email },
        session: { user: { email } },
      },
      res = { status };

    await deleteAccount(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      error: {
        message: EMAIL_NOT_FOUND_MESSAGE,
      },
    });
  });

  it('handles incorrect password', async () => {
    const email = 'success@test.com',
      req = {
        method: 'POST',
        body: { email, password: '678910' },
        session: { user: { email } },
      },
      res = { status };

    await deleteAccount(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      error: { message: INCORRECT_PASSWORD_MESSAGE },
    });
  });

  it('handles http method forbidden', async () => {
    const req = { method: 'GET' },
      res = { status };

    await deleteAccount(req, res);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      error: { message: HTTP_METHOD_ERROR_MESSAGE },
    });
  });

  it('handles token forbidden', async () => {
    const req = {
        method: 'POST',
        body: { email: 'email@test.com' },
        session: { user: {} },
      },
      res = { status };

    await deleteAccount(req, res);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      error: { message: TOKEN_ERROR_MESSAGE },
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

    await deleteAccount(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: { message: DEFAULT_ERROR_MESSAGE },
    });
  });
});
