import sanitize from 'mongo-sanitize';

type Body = Record<string, unknown>;

// This is here to sanitize any user-inputted data that may contain
// malicious characters intended to execute mongoDb commands.
export default function sanitizeBody(body: Body): Body {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid body argument passed to sanitizeBody');
  } else {
    return Object.entries(body).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: sanitize(value) }),
      {}
    );
  }
}
