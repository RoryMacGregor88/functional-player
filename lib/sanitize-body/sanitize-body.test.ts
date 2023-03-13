import sanitizeBody from './sanitize-body';

describe('sanitizeBody', () => {
  it('sanitizes body properties', () => {
    const testBody = {
      testEmail: 'test@email.com',
      testMalicious: { $test: '124' },
      testNonMalicious: { test: '123' },
      testNull: null,
      testUndefined: undefined,
      testInteger: 123,
      testFloat: 11.23,
      testZero: 0,
      testArray: ['123', 456, null, undefined],
    };

    const result = sanitizeBody(testBody);
    expect(result).toEqual({ ...testBody, testMalicious: {} });
  });

  it('throws error if no body', () => {
    const result = () => sanitizeBody(undefined);
    expect(result).toThrow(/invalid body argument passed to sanitizeBody/i);
  });

  it('throws error if body is not object', () => {
    const result = () => sanitizeBody('test string');
    expect(result).toThrow(/invalid body argument passed to sanitizeBody/i);
  });
});
