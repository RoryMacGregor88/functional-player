import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
  EMAIL_NOT_FOUND_MESSAGE,
  INCORRECT_PASSWORD_MESSAGE,
} from '@/src/utils/constants';

import login from '@/src/pages/api/auth/login';

let json = null,
  status = null;

jest.mock('bcryptjs', () => ({
  compare: (p1, p2) => p1 === p2,
}));

jest.mock('uuid', () => ({
  v4: () => '123',
}));

jest.mock('iron-session/next', () => ({
  withIronSessionApiRoute: (cb) => async (req, res) => cb(req, res),
}));

jest.mock('@/lib', () => ({
  sanitizeBody: (b) => b,
  syncStripeAndDb: ({ subscriptionId }) => {
    if (subscriptionId === 'error') {
      return { isError: true };
    } else if (subscriptionId === 'success') {
      return { subscriptionStatus: 'active' };
    }
  },
  connectToDatabase: jest.fn().mockImplementation(() => ({
    db: {
      collection: () => ({
        findOne: ({ email }) => {
          if (email === 'error@test.com') {
            throw new Error('test-error');
          } else if (email === 'success@test.com') {
            const testUser = {
              password: '12345',
              subscriptionId: 'success',
              sessions: [],
            };
            return testUser;
          } else if (email === 'stripeerror@test.com') {
            const testUser = {
              password: '12345',
              subscriptionId: 'error',
            };
            return testUser;
          } else if (email === 'nouser@test.com') {
            return null;
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

describe('login endpoint', () => {
  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
  });

  it('logs in', async () => {
    const save = jest.fn();

    const req = {
        method: 'POST',
        body: { email: 'success@test.com', password: '12345' },
        session: { save },
      },
      res = { status };

    await login(req, res);

    expect(save).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      resUser: {
        subscriptionId: 'success',
        subscriptionStatus: 'active',
      },
    });
  });

  it('handles user not found', async () => {
    const req = {
        method: 'POST',
        body: { email: 'nouser@email.com' },
      },
      res = { status };

    await login(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      error: { message: EMAIL_NOT_FOUND_MESSAGE },
    });
  });

  it('handles incorrect password', async () => {
    const req = {
        method: 'POST',
        body: { email: 'success@test.com', password: '678910' },
      },
      res = { status };

    await login(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      error: { message: INCORRECT_PASSWORD_MESSAGE },
    });
  });

  it('handles stripe sync error', async () => {
    const req = {
        method: 'POST',
        body: { email: 'stripeerror@test.com', password: '12345' },
      },
      res = { status };

    await login(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: { message: DEFAULT_ERROR_MESSAGE },
    });
  });

  it('handles http method forbidden', async () => {
    const req = { method: 'GET' },
      res = { status };

    await login(req, res);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      error: { message: HTTP_METHOD_ERROR_MESSAGE },
    });
  });

  it('handles error', async () => {
    const req = {
        method: 'POST',
        body: { email: 'error@test.com', password: '123' },
      },
      res = { status };

    await login(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: { message: DEFAULT_ERROR_MESSAGE },
    });
  });
});
