import sanitize from 'mongo-sanitize';

// This is here to sanitize any user-inputted data that may contain
// malicious characters intended to execute DB commands.
export default function sanitizeBody<Body>(body: Body): Partial<Body> {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid body argument passed to sanitizeBody');
  } else {
    return Object.entries(body).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: sanitize(value) }),
      {}
    );
  }
}
