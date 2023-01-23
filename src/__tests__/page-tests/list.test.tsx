import { render, screen } from '@/src/utils/test-utils';

import List from '@/src/pages/list';

jest.mock('@/lib', () => ({
  getCourses: () => {},
}));

const mockCourses = [
  {
    _id: '123',
    title: 'course-title-1',
    artist: 'John Smith',
    level: 'advanced',
    categories: [],
  },
  {
    _id: '456',
    title: 'course-title-2',
    artist: 'John Smith',
    level: 'advanced',
    categories: [],
  },
];

describe('List', () => {
  it('renders', () => {
    render(<List user={{ bookmarks: [] }} courses={[]} />);

    expect(screen.getByText(/your list/i)).toBeInTheDocument();
  });

  it('shows bookmarks if user has bookmarks', () => {
    render(<List user={{ bookmarks: ['123'] }} courses={mockCourses} />);

    expect(screen.getByText(/course-title-1/i)).toBeInTheDocument();
  });

  it('shows `No Bookmarks` message if user has no bookmarks', () => {
    render(<List user={{ bookmarks: [] }} courses={mockCourses} />);

    expect(
      screen.getByText(/you currently have no saved courses./i)
    ).toBeInTheDocument();
  });

  it('redirects to login if no user found', () => {
    const {
      router: { push },
    } = render(<List />, { push: jest.fn() });

    expect(push).toHaveBeenCalledWith('/login');
  });

  it('handles error', () => {
    const updateCtx = jest.fn(),
      message = 'test-error-message';

    render(
      <List
        user={{ bookmarks: [] }}
        updateCtx={updateCtx}
        error={{ message }}
      />
    );

    expect(updateCtx).toHaveBeenCalledWith({
      toastData: {
        severity: 'error',
        message,
      },
    });
  });
});
