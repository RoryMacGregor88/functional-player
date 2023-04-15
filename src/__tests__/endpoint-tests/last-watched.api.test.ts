import {
  TOKEN_ERROR_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
  EMAIL_NOT_FOUND_MESSAGE,
} from '@/src/utils/constants';

import lastWatched from '@/src/pages/api/last-watched';

let json = null,
  status = null;

jest.mock('iron-session/next', () => ({
  withIronSessionApiRoute: (cb) => async (req, res) => cb(req, res),
}));

jest.mock('@/lib', () => ({
  sanitizeBody: (b) => b,
  connectToDatabase: jest.fn().mockImplementation(() => ({
    db: {
      collection: () => ({
        findOneAndUpdate: ({ email }) => {
          if (email === 'error@test.com') {
            throw new Error('test-error');
          } else if (email === 'notfound@test.com') {
            return { value: null };
          } else if (email === 'success@test.com') {
            return { value: true };
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

describe('lastWatched endpoint', () => {
  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
  });

  it('updates last watched', async () => {
    const save = jest.fn(),
      email = 'success@test.com',
      req = {
        method: 'POST',
        body: { email, _id: '12345' },
        session: { user: { email }, save },
      },
      res = { status };

    await lastWatched(req, res);

    expect(save).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      resUser: { email, lastWatched: '12345' },
    });
  });

  it('handles user not found', async () => {
    const save = jest.fn(),
      email = 'notfound@test.com',
      req = {
        method: 'POST',
        body: { email, _id: '12345' },
        session: { user: { email }, save },
      },
      res = { status };

    await lastWatched(req, res);

    expect(save).not.toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      error: { message: EMAIL_NOT_FOUND_MESSAGE },
    });
  });

  it('handles http method forbidden', async () => {
    const req = { method: 'GET' },
      res = { status };

    await lastWatched(req, res);

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

    await lastWatched(req, res);

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

    await lastWatched(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: { message: DEFAULT_ERROR_MESSAGE },
    });
  });
});
