import { subDays, addDays } from 'date-fns';

import verifySessions from './verify-sessions';

describe('verifySessions', () => {
  it('rejects today', () => {
    const session = [{ id: '123', expirationDate: new Date().toISOString() }];
    const { validSessions, invalidSessions } = verifySessions(session);

    expect(validSessions).toHaveLength(0);
    expect(invalidSessions).toEqual(session);
  });

  it('works with all valid dates', () => {
    /** expiration dates are after today */
    const sessions = [
      { id: '123', expirationDate: addDays(new Date(), 1).toISOString() },
      { id: '456', expirationDate: addDays(new Date(), 2).toISOString() },
    ];

    const { validSessions, invalidSessions } = verifySessions(sessions);

    expect(validSessions).toEqual(sessions);
    expect(invalidSessions).toHaveLength(0);
  });

  it('works with all invalid dates', () => {
    /** expiration dates are before today */
    const sessions = [
      { id: '123', expirationDate: subDays(new Date(), 1).toISOString() },
      { id: '456', expirationDate: subDays(new Date(), 2).toISOString() },
    ];

    const { validSessions, invalidSessions } = verifySessions(sessions);

    expect(validSessions).toHaveLength(0);
    expect(invalidSessions).toEqual(sessions);
  });

  it('works with mixed valid/invalid dates', () => {
    /** some expiration dates are after today, some are not */
    const valid1 = {
        id: '123',
        expirationDate: addDays(new Date(), 1).toISOString(),
      },
      valid2 = {
        id: '456',
        expirationDate: addDays(new Date(), 2).toISOString(),
      },
      invalid1 = {
        id: '789',
        expirationDate: subDays(new Date(), 1).toISOString(),
      },
      invalid2 = {
        id: '101',
        expirationDate: subDays(new Date(), 2).toISOString(),
      };

    const { validSessions, invalidSessions } = verifySessions([
      valid1,
      invalid1,
      invalid2,
      valid2,
    ]);

    expect(validSessions).toEqual([valid1, valid2]);
    expect(invalidSessions).toEqual([invalid1, invalid2]);
  });
});
