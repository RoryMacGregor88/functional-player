import {
  DEFAULT_ERROR_MESSAGE,
  HTTP_METHOD_ERROR_MESSAGE,
  EMAIL_NOT_FOUND_MESSAGE,
  INCORRECT_PASSWORD_MESSAGE,
} from '@/src/utils/constants';

import {
  TEST_STRIPE_ERROR_ID,
  TEST_STRIPE_SUCCESS_ID,
  TEST_ERROR_EMAIL,
  TEST_SUCCESS_EMAIL,
  TEST_NO_USER_EMAIL,
  TEST_STRIPE_ERROR_EMAIL,
} from '@/src/__tests__/test-constants';

import login from '@/src/pages/api/auth/login';

let json = null,
  status = null;

describe('login endpoint', () => {
  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
  });

  it('logs in', async () => {
    const save = jest.fn();

    const req = {
        method: 'POST',
        body: { email: TEST_SUCCESS_EMAIL, password: '12345' },
        session: { save },
      },
      res = { status };

    await login(req, res);

    expect(save).toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      resUser: {
        subscriptionId: TEST_STRIPE_SUCCESS_ID,
        subscriptionStatus: 'active',
      },
    });
  });

  it('handles user not found', async () => {
    const req = {
        method: 'POST',
        body: { email: TEST_NO_USER_EMAIL },
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
        body: { email: TEST_SUCCESS_EMAIL, password: '678910' },
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
        body: { email: TEST_STRIPE_ERROR_EMAIL, password: '12345' },
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
        body: { email: TEST_ERROR_EMAIL, password: '123' },
      },
      res = { status };

    await login(req, res);

    expect(status).toHaveBeenCalledWith(500);
    expect(json).toHaveBeenCalledWith({
      error: { message: DEFAULT_ERROR_MESSAGE },
    });
  });
});
