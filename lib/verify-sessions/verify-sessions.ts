import { parseISO } from 'date-fns';

import { Session } from '@/src/utils/interfaces';

interface VerifiedSessions {
  validSessions: Session[];
  invalidSessions: Session[];
}

/**
 * separate valid and invalid sessions based on whether
 * or not the expiration date is still in the future
 */
export default function verifySessions(sessions: Session[]): VerifiedSessions {
  const today = new Date();
  return sessions.reduce(
    (acc, cur) => {
      const result =
        parseISO(cur.expirationDate) > today
          ? { ...acc, validSessions: [...acc.validSessions, cur] }
          : { ...acc, invalidSessions: [...acc.invalidSessions, cur] };

      return result;
    },
    { validSessions: [], invalidSessions: [] }
  );
}
