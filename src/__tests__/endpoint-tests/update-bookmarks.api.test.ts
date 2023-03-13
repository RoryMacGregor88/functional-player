import {
  TOKEN_ERROR_MESSAGE,
  DEFAULT_ERROR_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
} from '@/src/utils/constants';

import updateBookmarks from '@/src/pages/api/update-bookmarks';

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
            throw new Error();
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

describe('updateBookmarks endpoint', () => {
  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
  });

  it('updates bookmarks', async () => {
    const save = jest.fn(),
      email = 'success@test.com',
      user = { email },
      bookmarks = ['123', '456'],
      req = {
        method: 'POST',
        body: { email, bookmarks },
        session: { user, save },
      },
      res = { status };

    await updateBookmarks(req, res);

    expect(save).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ resUser: { ...user, bookmarks } });
  });

  it('handles http method forbidden', async () => {
    const req = { method: 'GET' },
      res = { status };

    await updateBookmarks(req, res);

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

    await updateBookmarks(req, res);

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

    await updateBookmarks(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: { message: DEFAULT_ERROR_MESSAGE },
    });
  });
});
