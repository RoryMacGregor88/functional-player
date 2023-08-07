import { render, screen, waitFor, userEvent } from '@/src/utils/test-utils';

import Dashboard from '@/src/pages/dashboard';

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

let updateCtx = null;

describe('Dashboard', () => {
  beforeEach(() => {
    updateCtx = jest.fn();
  });

  it('renders', () => {
    render(
      <Dashboard
        updateCtx={updateCtx}
        user={mockUser}
        courses={mockCourses}
        error={null}
      />
    );

    mockCourses.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('renders when no user found', () => {
    render(
      <Dashboard updateCtx={updateCtx} courses={mockCourses} error={null} />
    );

    mockCourses.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('does not display bookmarks if user has no bookmarks', () => {
    render(
      <Dashboard
        updateCtx={updateCtx}
        user={mockUser}
        courses={mockCourses}
        error={null}
      />
    );

    expect(screen.queryByText(/your list/i)).not.toBeInTheDocument();
  });

  it('displays bookmarks if user has bookmarks', () => {
    const user = { ...mockUser, bookmarks: ['123'] };
    render(
      <Dashboard
        updateCtx={updateCtx}
        user={user}
        courses={mockCourses}
        error={null}
      />
    );

    expect(screen.getByText(/your list/i)).toBeInTheDocument();
  });

  it('does not display lastWatched if user has no lastWatched', () => {
    render(
      <Dashboard
        updateCtx={updateCtx}
        user={mockUser}
        courses={mockCourses}
        error={null}
      />
    );

    expect(screen.queryByText(/continue watching/i)).not.toBeInTheDocument();
  });

  it('displays lastWatched if user has lastWatched', () => {
    const user = { ...mockUser, lastWatched: '123' };
    render(
      <Dashboard
        updateCtx={updateCtx}
        user={user}
        courses={mockCourses}
        error={null}
      />
    );

    expect(screen.getByText(/continue watching/i)).toBeInTheDocument();
  });

  it('opens video dialog if video clicked', async () => {
    render(
      <Dashboard
        updateCtx={updateCtx}
        user={mockUser}
        courses={mockCourses}
        error={null}
      />,
      { updateCtx }
    );

    userEvent.click(screen.getAllByTestId(/course-title-1/i)[0]);

    await waitFor(() => {
      const expected = { selectedVideo: mockCourses[0] };
      expect(updateCtx).toHaveBeenCalledWith(expected);
    });
  });

  it('handles server error', async () => {
    const message = 'test-error-message';

    render(
      <Dashboard
        updateCtx={updateCtx}
        user={mockUser}
        error={{ message }}
        courses={null}
      />
    );

    const expected = {
      toastData: {
        severity: 'error',
        message,
      },
    };

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith(expected);
    });
  });
});
