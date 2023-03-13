import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
} from '@/src/utils/constants';

import contact from '@/src/pages/api/contact';

let json = null,
  status = null;

jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: () => {},
  }),
}));

jest.mock('@/lib', () => ({
  sanitizeBody: (b) => b,
  connectToDatabase: jest.fn().mockImplementation(() => ({
    db: {
      collection: () => ({
        findOne: ({ email }) => {
          if (email === 'error@test.com') {
            throw new Error();
          } else if (email === 'success@test.com') {
            const testUser = { password: '12345' };
            return testUser;
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

describe('contact endpoint', () => {
  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
  });

  it('sends mail', async () => {
    const email = 'success@test.com',
      req = {
        method: 'POST',
        body: { email },
      },
      res = { status };

    await contact(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ ok: true });
  });

  it('handles http method forbidden', async () => {
    const req = { method: 'GET' },
      res = { status };

    await contact(req, res);

    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({
      error: { message: HTTP_METHOD_ERROR_MESSAGE },
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

    await contact(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: { message: DEFAULT_ERROR_MESSAGE },
    });
  });
});
