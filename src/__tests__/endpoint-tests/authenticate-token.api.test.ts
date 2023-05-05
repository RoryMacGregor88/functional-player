import authenticateSession from '@/src/pages/api/auth/authenticate-session';

import {
  DEFAULT_ERROR_MESSAGE,
  GET_METHOD_ERROR_MESSAGE,
  SESSION_EXPIRED_MESSAGE,
} from '@/src/utils/constants';

let json = null,
  status = null;

jest.mock('iron-session/next', () => ({
  withIronSessionApiRoute: (cb) => async (req, res) => cb(req, res),
}));

jest.mock('@/lib', () => ({
  connectToDatabase: jest.fn().mockImplementation(() => ({
    db: {
      collection: () => ({
        findOne: ({ email }) => {
          if (!!email) {
            if (email === 'error@test.com') {
              throw new Error('test-error');
            } else if (email === 'nosessions@test.com') {
              return { sessions: [] };
            } else if (email === 'invalidsession@test.com') {
              return { sessions: [{ id: '123' }] };
            } else if (email === 'success@test.com') {
              return { sessions: [{ id: '456' }] };
            }
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
  verifySessions: jest.fn().mockImplementation(() => ({
    validSessions: [{ id: '123' }],
    invalidSessions: [],
  })),
}));

describe('authenticateSession endpoint', () => {
  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
  });

  it('returns user if found in session', async () => {
    const email = 'success@test.com',
      req = {
        method: 'GET',
        body: { email },
        session: { id: '123', user: { email } },
      },
      res = { status };

    await authenticateSession(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ resUser: { email } });
  });

  it('returns null user if session not found', async () => {
    const email = 'test@email.com',
      req = {
        method: 'GET',
        body: { email },
        session: {},
      },
      res = { status };

    await authenticateSession(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ resUser: null });
  });

  it('rejects request if user`s stored id array is empty', async () => {
    const email = 'nosessions@test.com',
      destroy = jest.fn(),
      req = {
        method: 'GET',
        body: { email },
        session: { id: '123', user: { email }, destroy },
      },
      res = { status };

    await authenticateSession(req, res);

    expect(destroy).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      error: { message: SESSION_EXPIRED_MESSAGE },
      redirect: true,
    });
  });

  it('rejects request if session is invalid', async () => {
    const email = 'invalidsession@test.com',
      destroy = jest.fn(),
      req = {
        method: 'GET',
        body: { email },
        session: { id: '456', user: { email }, destroy },
      },
      res = { status };

    await authenticateSession(req, res);

    expect(destroy).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      error: { message: SESSION_EXPIRED_MESSAGE },
      redirect: true,
    });
  });

  it('handles http method forbidden', async () => {
    const req = { method: 'DELETE' },
      res = { status };

    await authenticateSession(req, res);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      error: { message: GET_METHOD_ERROR_MESSAGE },
    });
  });

  it('handles error', async () => {
    const email = 'error@test.com',
      req = {
        method: 'GET',
        body: { email },
        session: { id: '123', user: { email } },
      },
      res = { status };

    await authenticateSession(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: { message: DEFAULT_ERROR_MESSAGE },
    });
  });
});
