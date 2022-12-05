import { generateTempPassword } from '@/src/utils';

describe('generateTempPassword', () => {
  it('generates a string of 6 characters', () => {
    const result = generateTempPassword();
    expect(result).toHaveLength(6);
  });
});
