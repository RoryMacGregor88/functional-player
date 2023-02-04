import { render, screen, waitFor, userEvent } from '@/src/utils/test-utils';

import Artists from '@/src/pages/artists';

import { DEFAULT_ERROR_MESSAGE } from '@/src/utils/constants';

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
    },
    {
      _id: '456',
      title: 'course-title-2',
      artist: 'Peter Green',
      level: 'advanced',
    },
  ];

let updateCtx = null;

describe('Artists', () => {
  beforeEach(() => {
    updateCtx = jest.fn();
  });

  it('renders', () => {
    render(
      <Artists
        updateCtx={updateCtx}
        user={mockUser}
        courses={mockCourses}
        error={null}
      />,
      { query: { artist: 'peter-green' } }
    );

    mockCourses.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('redirects to dashboard if no query', async () => {
    const {
      router: { push },
    } = render(
      <Artists
        updateCtx={updateCtx}
        user={mockUser}
        courses={mockCourses}
        error={null}
      />,
      { push: jest.fn() }
    );

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/dashboard');
      expect(updateCtx).toHaveBeenCalledWith({
        toastData: {
          severity: 'error',
          message: DEFAULT_ERROR_MESSAGE,
        },
      });
    });
  });

  it('rendirects to dashboard if no matching artist found', async () => {
    const {
      router: { push },
    } = render(
      <Artists
        updateCtx={updateCtx}
        user={mockUser}
        courses={mockCourses}
        error={null}
      />,
      { push: jest.fn(), query: { artist: 'adfasdfasdf' } }
    );

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/dashboard');
      expect(updateCtx).toHaveBeenCalledWith({
        toastData: {
          severity: 'error',
          message: DEFAULT_ERROR_MESSAGE,
        },
      });
    });
  });

  it('does not display bookmarks if user has no bookmarks', () => {
    render(
      <Artists
        updateCtx={updateCtx}
        user={mockUser}
        courses={mockCourses}
        error={null}
      />,
      { query: { artist: 'peter-green' } }
    );

    expect(screen.queryByText(/your list/i)).not.toBeInTheDocument();
  });

  it('displays bookmarks if user has bookmarks', () => {
    const user = { ...mockUser, bookmarks: ['123'] };
    render(
      <Artists
        updateCtx={updateCtx}
        user={user}
        courses={mockCourses}
        error={null}
      />,
      { query: { artist: 'peter-green' } }
    );

    expect(screen.getByText(/your list/i)).toBeInTheDocument();
  });

  it('does not display lastWatched if user has no lastWatched', () => {
    render(
      <Artists
        updateCtx={updateCtx}
        user={mockUser}
        courses={mockCourses}
        error={null}
      />,
      { query: { artist: 'peter-green' } }
    );

    expect(screen.queryByText(/continue watching/i)).not.toBeInTheDocument();
  });

  it('displays lastWatched if user has lastWatched', () => {
    const user = { ...mockUser, lastWatched: '123' };
    render(
      <Artists
        updateCtx={updateCtx}
        user={user}
        courses={mockCourses}
        error={null}
      />,
      { query: { artist: 'peter-green' } }
    );

    expect(screen.getByText(/continue watching/i)).toBeInTheDocument();
  });

  it('opens video dialog if video clicked', async () => {
    render(
      <Artists
        updateCtx={updateCtx}
        user={mockUser}
        courses={mockCourses}
        error={null}
      />,
      { updateCtx, query: { artist: 'peter-green' } }
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
      <Artists
        updateCtx={updateCtx}
        user={mockUser}
        courses={null}
        error={{ message }}
      />,
      { push: jest.fn(), query: { artist: 'peter-green' } }
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
