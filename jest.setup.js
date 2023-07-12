import '@testing-library/jest-dom';

import { DEFAULT_ERROR_MESSAGE } from '@/src/utils/constants';

import {
  TEST_STRIPE_ERROR_ID,
  TEST_STRIPE_SUCCESS_ID,
  TEST_INVALID_SESSION_ID,
  TEST_VALID_SESSION_ID,
  TEST_ERROR_EMAIL,
  TEST_SUCCESS_EMAIL,
  TEST_STRIPE_ERROR_EMAIL,
  TEST_NO_USER_EMAIL,
  TEST_NO_SESSIONS_EMAIL,
  TEST_INVALID_SESSION_EMAIL,
  TEST_VALID_SESSION_EMAIL,
} from '@/src/__tests__/test-constants';

/**
 * This is here to mock out the various modules that are used in
 * tests, but not being tested directly in the endpoints. For the
 * most complex, the database module, mock emails are used to trigger
 * different responses for use in individual tests.
 */

jest.mock('bcryptjs', () => ({
  compare: jest.fn().mockImplementation((p1, p2) => p1 === p2),
}));

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('123'),
}));

jest.mock('iron-session/next', () => ({
  withIronSessionApiRoute: jest
    .fn()
    .mockImplementation((cb) => async (req, res) => cb(req, res)),
}));

jest.mock('@/lib', () => ({
  sanitizeBody: jest.fn().mockImplementation((b) => b),
  syncStripeAndDb: jest.fn().mockImplementation(({ subscriptionId }) => {
    if (subscriptionId === TEST_STRIPE_ERROR_ID) {
      return { isError: true };
    } else if (subscriptionId === TEST_STRIPE_SUCCESS_ID) {
      return { subscriptionStatus: 'active' };
    }
  }),
  logServerError: jest
    .fn()
    .mockImplementation(async (handler, error) =>
      console.log(`TEST ERROR in ${handler}: ${error}`)
    ),
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
  verifySessions: jest.fn().mockReturnValue({
    validSessions: [{ id: TEST_VALID_SESSION_ID }],
    invalidSessions: [],
  }),
  connectToDatabase: jest.fn().mockImplementation(() => ({
    db: {
      collection: jest.fn().mockImplementation(() => ({
        updateOne: jest.fn().mockImplementation(() => {}),
        findOne: jest.fn().mockImplementation(({ email }) => {
          const successUser = {
            email,
            password: '12345',
            subscriptionId: TEST_STRIPE_SUCCESS_ID,
            sessions: [],
          };
          switch (email) {
            case TEST_ERROR_EMAIL:
              throw new Error('test-error');
            case TEST_SUCCESS_EMAIL:
              return successUser;
            case TEST_STRIPE_ERROR_EMAIL:
              return {
                password: '12345',
                /** for use in syncStripeAndDb above */
                subscriptionId: TEST_STRIPE_ERROR_ID,
              };
            case TEST_NO_USER_EMAIL:
              return null;
            case TEST_NO_SESSIONS_EMAIL:
              return successUser;
            case TEST_INVALID_SESSION_EMAIL:
              return {
                ...successUser,
                sessions: [{ id: TEST_INVALID_SESSION_ID }],
              };
            case TEST_VALID_SESSION_EMAIL:
              return {
                ...successUser,
                sessions: [{ id: TEST_VALID_SESSION_ID }],
              };
          }
        }),
      })),
    },
  })),
}));
