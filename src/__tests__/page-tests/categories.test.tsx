import { render, screen, waitFor, userEvent } from '@/src/utils/test-utils';

import Categories from '@/src/pages/categories';

jest.mock('@/lib', () => ({
  getCourses: () => {},
}));

const mockUser = {
    username: 'test-username',
    bookmarks: [],
    lastWatched: '',
  },
  mockCourses = [
    {
      _id: '123',
      title: 'course-title-1',
      artist: 'Peter Green',
      level: 'advanced',
      categories: ['blues'],
    },
    {
      _id: '456',
      title: 'course-title-2',
      artist: 'Peter Green',
      level: 'advanced',
      categories: ['blues'],
    },
  ];

let updateCtx = null;

describe('Categories', () => {
  beforeEach(() => {
    updateCtx = jest.fn();
  });

  it('renders', () => {
    render(
      <Categories
        updateCtx={updateCtx}
        user={mockUser}
        courses={mockCourses}
        error={null}
      />,
      { query: { category: 'blues' } }
    );

    mockCourses.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('redirects to dashboard if no query', async () => {
    const {
      router: { push },
    } = render(
      <Categories
        updateCtx={updateCtx}
        user={mockUser}
        courses={mockCourses}
        error={null}
      />,
      { push: jest.fn() }
    );

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/dashboard');
      expect(updateCtx).not.toHaveBeenCalled();
    });
  });

  it('rendirects to dashboard if no matching category found', async () => {
    const {
      router: { push },
    } = render(
      <Categories
        updateCtx={updateCtx}
        user={mockUser}
        courses={mockCourses}
        error={null}
      />,
      { push: jest.fn() }
    );

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/dashboard');
      expect(updateCtx).not.toHaveBeenCalled();
    });
  });

  it('does not display bookmarks if user has no bookmarks', () => {
    render(
      <Categories
        updateCtx={updateCtx}
        user={mockUser}
        courses={mockCourses}
        error={null}
      />,
      { query: { category: 'blues' } }
    );

    expect(screen.queryByText(/your list/i)).not.toBeInTheDocument();
  });

  it('displays bookmarks if user has bookmarks', () => {
    const user = { ...mockUser, bookmarks: ['123'] };
    render(
      <Categories
        updateCtx={updateCtx}
        user={user}
        courses={mockCourses}
        error={null}
      />,
      { query: { category: 'blues' } }
    );

    expect(screen.getByText(/your list/i)).toBeInTheDocument();
  });

  it('does not display lastWatched if user has no lastWatched', () => {
    render(
      <Categories
        updateCtx={updateCtx}
        user={mockUser}
        courses={mockCourses}
        error={null}
      />,
      { query: { category: 'blues' } }
    );

    expect(screen.queryByText(/continue watching/i)).not.toBeInTheDocument();
  });

  it('displays lastWatched if user has lastWatched', () => {
    const user = { ...mockUser, lastWatched: '123' };
    render(
      <Categories
        updateCtx={updateCtx}
        user={user}
        courses={mockCourses}
        error={null}
      />,
      { query: { category: 'blues' } }
    );

    expect(screen.getByText(/continue watching/i)).toBeInTheDocument();
  });

  it('opens video dialog if video clicked', async () => {
    render(
      <Categories
        updateCtx={updateCtx}
        user={mockUser}
        courses={mockCourses}
        error={null}
      />,
      { updateCtx, query: { category: 'blues' } }
    );

    userEvent.click(screen.getByTestId(/course-title-1/i));

    await waitFor(() => {
      const expected = { selectedVideo: mockCourses[0] };
      expect(updateCtx).toHaveBeenCalledWith(expected);
    });
  });

  it('handles server error', async () => {
    const message = 'test-error-message';

    const {
      router: { push },
    } = render(
      <Categories
        updateCtx={updateCtx}
        user={mockUser}
        courses={null}
        error={{ message }}
      />,
      { push: jest.fn(), query: { category: 'blues' } }
    );

    const expected = {
      toastData: {
        severity: 'error',
        message,
      },
    };

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/dashboard');
      expect(updateCtx).toHaveBeenCalledWith(expected);
    });
  });
});
