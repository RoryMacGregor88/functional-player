import syncSubscriptionStatus from '@/src/pages/api/auth/sync-subscription-status';

import {
  TOKEN_ERROR_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
} from '@/src/utils/constants';

let json = null,
  status = null;

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
            return true;
          }
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

describe('syncSubscriptionStatus endpoint', () => {
  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
  });

  it('syncs subscription status', async () => {
    const save = jest.fn(),
      email = 'success@test.com',
      req = {
        method: 'POST',
        body: { email, subscriptionId: 'success' },
        session: { user: { email }, save },
      },
      res = { status };

    await syncSubscriptionStatus(req, res);

    expect(save).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      resUser: { email: 'success@test.com', subscriptionStatus: 'active' },
    });
  });

  it('handles sync error', async () => {
    const email = 'success@test.com',
      req = {
        method: 'POST',
        body: { email, subscriptionId: 'error' },
        session: { user: { email } },
      },
      res = { status };

    await syncSubscriptionStatus(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: { message: DEFAULT_ERROR_MESSAGE },
    });
  });

  it('handles http method forbidden', async () => {
    const req = { method: 'GET' },
      res = { status };

    await syncSubscriptionStatus(req, res);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      error: { message: HTTP_METHOD_ERROR_MESSAGE },
    });
  });

  it('handles token forbidden', async () => {
    const req = {
        method: 'POST',
        body: { email: 'success@test.com' },
        session: { user: {} },
      },
      res = { status };

    await syncSubscriptionStatus(req, res);

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

    await syncSubscriptionStatus(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: { message: DEFAULT_ERROR_MESSAGE },
    });
  });
});
