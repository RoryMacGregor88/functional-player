import authenticateSession from '@/src/pages/api/auth/authenticate-session';

import {
  DEFAULT_ERROR_MESSAGE,
  GET_METHOD_ERROR_MESSAGE,
  SESSION_EXPIRED_MESSAGE,
} from '@/src/utils/constants';

import {
  STRIPE_TEST_ERROR_ID,
  STRIPE_TEST_SUCCESS_ID,
  TEST_INVALID_SESSION_ID,
  TEST_VALID_SESSION_ID,
  TEST_ERROR_EMAIL,
  TEST_SUCCESS_EMAIL,
  TEST_STRIPE_ERROR_EMAIL,
  TEST_NO_SESSIONS_EMAIL,
  TEST_INVALID_SESSION_EMAIL,
  TEST_VALID_SESSION_EMAIL,
} from '@/src/__tests__/test-constants';

let json = null,
  status = null;

describe('authenticateSession endpoint', () => {
  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
  });

  it('returns user if found in session', async () => {
    const save = jest.fn(),
      email = TEST_VALID_SESSION_EMAIL,
      user = {
        email,
        subscriptionId: STRIPE_TEST_SUCCESS_ID,
      },
      req = {
        method: 'GET',
        body: { email },
        session: {
          id: TEST_VALID_SESSION_ID,
          user,
          save,
        },
      },
      res = { status };

    await authenticateSession(req, res);

    expect(save).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      resUser: { ...user, subscriptionStatus: 'active' },
    });
  });

  it('returns null user if session not found', async () => {
    const email = TEST_SUCCESS_EMAIL,
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
    const email = TEST_NO_SESSIONS_EMAIL,
      destroy = jest.fn(),
      req = {
        method: 'GET',
        body: { email },
        session: {
          id: TEST_VALID_SESSION_ID,
          user: { email, subscriptionId: STRIPE_TEST_SUCCESS_ID },
          destroy,
        },
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
    const email = TEST_INVALID_SESSION_EMAIL,
      destroy = jest.fn(),
      req = {
        method: 'GET',
        body: { email },
        session: {
          id: TEST_INVALID_SESSION_ID,
          user: { email, subscriptionId: STRIPE_TEST_SUCCESS_ID },
          destroy,
        },
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

  it('handles stripe sync error', async () => {
    const email = TEST_STRIPE_ERROR_EMAIL,
      req = {
        method: 'GET',
        body: { email, password: '12345' },
        session: {
          id: TEST_VALID_SESSION_ID,
          user: { email, subscriptionId: STRIPE_TEST_ERROR_ID },
        },
      },
      res = { status };

    await authenticateSession(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: { message: DEFAULT_ERROR_MESSAGE },
    });
  });

  it('handles error', async () => {
    const email = TEST_ERROR_EMAIL,
      req = {
        method: 'GET',
        body: { email },
        session: {
          id: TEST_VALID_SESSION_ID,
          user: { email, subscriptionId: STRIPE_TEST_SUCCESS_ID },
        },
      },
      res = { status };

    await authenticateSession(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: { message: DEFAULT_ERROR_MESSAGE },
    });
  });
});
