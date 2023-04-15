import formatDate from './format-date';

describe('formatDate', () => {
  it('converts ISO strings to written dates', () => {
    const result = formatDate('2023-04-15T22:49:20.289Z');
    expect(result).toEqual('April 2nd 2023');
  });
});
