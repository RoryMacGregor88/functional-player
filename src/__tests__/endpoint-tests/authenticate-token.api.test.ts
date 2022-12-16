import authenticateToken from '@/src/pages/api/auth/authenticate-token';

import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
} from '@/src/utils/constants';

let json = null,
  status = null;

jest.mock('iron-session/next', () => ({
  withIronSessionApiRoute: (cb) => async (req, res) => cb(req, res),
}));

jest.mock('@/lib', () => ({
  connectToDatabase: jest.fn().mockImplementation(() => {
    // mock server error
    throw new Error();
  }),
  logServerError: jest.fn().mockImplementation(() => {}),
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

describe('authenticateToken endpoint', () => {
  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
  });

  it('returns user if found in token', async () => {
    const email = 'test@email.com',
      req = {
        method: 'GET',
        body: { email },
        session: { user: { email } },
      },
      res = { status };

    await authenticateToken(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ resUser: { email } });
  });

  it('returns null user if token not found', async () => {
    const email = 'test@email.com',
      req = {
        method: 'GET',
        body: { email },
        session: {},
      },
      res = { status };

    await authenticateToken(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ resUser: null });
  });

  it('handles http method forbidden', async () => {
    const req = { method: 'DELETE' },
      res = { status };

    await authenticateToken(req, res);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      error: { message: 'Invalid method, only GET requests permitted.' },
    });
  });

  it('handles error', async () => {
    const email = 'test@email.com',
      req = {
        method: 'GET',
        body: { email },
        // no session object, throw error
      },
      res = { status };

    await authenticateToken(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: { message: DEFAULT_ERROR_MESSAGE },
    });
  });
});
