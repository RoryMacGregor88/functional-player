import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
  SESSION_ERROR_MESSAGE,
} from '@/src/utils/constants';

let json = null,
  status = null;

import logout from '@/src/pages/api/auth/logout';

jest.mock('iron-session/next', () => ({
  withIronSessionApiRoute: (cb) => async (req, res) => cb(req, res),
}));

jest.mock('@/lib', () => ({
  sanitizeBody: (b) => b,
  connectToDatabase: () => ({
    db: {
      collection: () => ({
        updateOne: ({ email }) => {
          if (email === 'error@test.com') {
            throw new Error('test-error');
          }
        },
      }),
    },
  }),
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

describe('logout endpoint', () => {
  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
  });

  it('logs out', async () => {
    const destroy = jest.fn(),
      email = 'test@email.com',
      req = {
        method: 'POST',
        session: { user: { email }, destroy },
        body: { email },
      },
      res = { status };

    await logout(req, res);

    expect(destroy).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ resUser: null });
  });

  it('handles http method forbidden', async () => {
    const req = { method: 'GET' },
      res = { status };

    await logout(req, res);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      error: { message: HTTP_METHOD_ERROR_MESSAGE },
    });
  });

  it('handles session forbidden', async () => {
    const req = {
        method: 'POST',
        body: { email: 'test@email.com' },
        session: {},
      },
      res = { status };

    await logout(req, res);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      error: { message: SESSION_ERROR_MESSAGE },
    });
  });

  it('handles error', async () => {
    // mock database error
    const destroy = jest.fn(),
      email = 'error@test.com',
      req = {
        method: 'POST',
        session: { user: { email }, destroy },
        body: { email },
      },
      res = { status };

    await logout(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: { message: DEFAULT_ERROR_MESSAGE },
    });
  });
});
