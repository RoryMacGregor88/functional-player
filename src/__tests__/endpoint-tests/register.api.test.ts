import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
  EMAIL_ALREADY_EXISTS_MESSAGE,
  USERNAME_TAKEN_MESSAGE,
} from '@/src/utils/constants';

import register from '@/src/pages/api/auth/register';

let json = null,
  status = null;

jest.mock('stripe', () =>
  jest.fn().mockImplementation(() => ({
    customers: { create: () => ({}) },
    subscriptions: {
      create: () => ({
        latest_invoice: {
          payment_intent: { client_secret: 'test-client-secret' },
        },
      }),
    },
  }))
);

jest.mock('bcryptjs', () => ({
  hash: () => {},
}));

jest.mock('uuid', () => ({
  v4: () => '123',
}));

jest.mock('@/lib', () => ({
  sanitizeBody: (b) => b,
  connectToDatabase: jest.fn().mockImplementation(() => ({
    db: {
      collection: () => ({
        findOne: ({ email, username }) => {
          if (!!username) {
            if (username === 'success-username') {
              return false;
            } else if (username === 'existing-username') {
              return true;
            }
          }

          if (!!email) {
            if (email === 'error@test.com') {
              throw new Error('test-error');
            } else if (email === 'existingemail@test.com') {
              return true;
            } else if (email === 'success@test.com') {
              return false;
            }
          }
        },
        insertOne: () => {},
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

describe('register endpoint', () => {
  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
  });

  it('registers', async () => {
    const email = 'success@test.com',
      req = {
        method: 'POST',
        body: { email, username: 'success-username' },
        session: { user: { email } },
      },
      res = { status };

    await register(req, res);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({
      clientSecret: 'test-client-secret',
    });
  });

  it('handles http method forbidden', async () => {
    const req = { method: 'GET' },
      res = { status };

    await register(req, res);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      error: { message: HTTP_METHOD_ERROR_MESSAGE },
    });
  });

  it('handles existing email', async () => {
    const email = 'existingemail@test.com',
      req = {
        method: 'POST',
        body: { email },
        session: { user: { email } },
      },
      res = { status };

    await register(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      error: {
        message: EMAIL_ALREADY_EXISTS_MESSAGE,
      },
    });
  });

  it('handles existing username', async () => {
    const email = 'success@test.com',
      req = {
        method: 'POST',
        body: { email, username: 'existing-username' },
        session: { user: { email } },
      },
      res = { status };

    await register(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      error: {
        message: USERNAME_TAKEN_MESSAGE,
      },
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

    await register(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: { message: DEFAULT_ERROR_MESSAGE },
    });
  });
});
