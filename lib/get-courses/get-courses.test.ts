import getCourses from './get-courses';

import { DEFAULT_ERROR_MESSAGE } from '@/src/utils/constants';

jest.mock('@/lib', () => ({
  connectToDatabase: jest.fn().mockImplementation(() => ({
    db: {
      collection: () => ({
        find: (find) => {
          if (!find) {
            throw new Error();
          } else {
            return {
              toArray: () => [
                { title: 'test-title', courseId: '123', trailerId: '456' },
              ],
            };
          }
        },
      }),
    },
  })),
}));

describe('getCourses', () => {
  it('returns courseId if user is authorized', async () => {
    const user = { subscriptionStatus: 'active' },
      expected = {
        error: null,
        courses: [
          {
            title: 'test-title',
            videoId: '123',
          },
        ],
      };

    const result = await getCourses(user);
    expect(result).toEqual(expected);
  });

  it('returns trailerId if user is not authorized', async () => {
    const user = { subscriptionStatus: null },
      expected = {
        error: null,
        courses: [
          {
            title: 'test-title',
            videoId: '456',
          },
        ],
      };

    const result = await getCourses(user);
    expect(result).toEqual(expected);
  });

  it('returns trailerId if user not found', async () => {
    const expected = {
      error: null,
      courses: [
        {
          title: 'test-title',
          videoId: '456',
        },
      ],
    };

    const result = await getCourses(undefined);
    expect(result).toEqual(expected);
  });

  it('handles error', async () => {
    const expected = {
      courses: null,
      error: { message: 'An unexpected error has occurred.' },
    };

    const result = await getCourses(null, null);

    expect(result).toEqual(expected);
  });
});
