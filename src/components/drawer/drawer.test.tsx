import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import Drawer from './drawer.component';

import { User } from '@/src/utils/interfaces';

enableFetchMocks();

const mockUser: User = {
  _id: '1',
  email: 'test@email.com',
  username: 'John Smith',
  subscriptionId: '2',
  customerId: '3',
  subscriptionStatus: 'active',
  bookmarks: ['1', '2', '3'],
  lastWatched: '1',
};

let setIsDrawerOpen = null;

describe('drawer', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    setIsDrawerOpen = jest.fn();
  });

  it('renders when prop is true', () => {
    render(<Drawer isDrawerOpen={true} user={mockUser} />);
    expect(screen.getByTestId('drawer')).toBeInTheDocument();
  });

  it('does not render when prop is false', () => {
    render(<Drawer isDrawerOpen={false} user={mockUser} />);
    expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
  });

  it('routes to links and closes drawer', async () => {
    const {
      router: { push },
    } = render(
      <Drawer
        isDrawerOpen={true}
        setIsDrawerOpen={setIsDrawerOpen}
        user={null}
      />,
      { push: jest.fn() }
    );

    userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(setIsDrawerOpen).toHaveBeenCalled();
      expect(push).toHaveBeenCalledWith('/login', {
        forceOptimisticNavigation: false,
      });
    });
  });

  it('shows logged in icons', () => {
    render(
      <Drawer
        isDrawerOpen={true}
        setIsDrawerOpen={setIsDrawerOpen}
        user={mockUser}
      />
    );

    expect(screen.getByRole('link', { name: /logout/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: /login/i })
    ).not.toBeInTheDocument();
  });

  it('shows logged out icons', () => {
    render(
      <Drawer
        isDrawerOpen={true}
        setIsDrawerOpen={setIsDrawerOpen}
        user={null}
      />
    );

    expect(
      screen.queryByRole('link', { name: /logout/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  it('logs user out', async () => {
    fetchMock.mockResponse(JSON.stringify({ resUser: null }));

    const { updateCtx } = render(
      <Drawer
        isDrawerOpen={true}
        setIsDrawerOpen={setIsDrawerOpen}
        user={mockUser}
      />,
      { updateCtx: jest.fn() }
    );

    userEvent.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith({ user: null });
      expect(setIsDrawerOpen).toHaveBeenCalled();
    });
  });

  it('handles error', async () => {
    const message = 'test error message';

    fetchMock.mockResponse(JSON.stringify({ error: { message } }));

    const { updateCtx } = render(
      <Drawer
        isDrawerOpen={true}
        setIsDrawerOpen={setIsDrawerOpen}
        user={mockUser}
      />,
      { updateCtx: jest.fn() }
    );

    userEvent.click(screen.getByRole('button', { name: /logout/i }));

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith({
        toastData: {
          message,
          severity: 'error',
        },
      });
      expect(setIsDrawerOpen).toHaveBeenCalled();
    });
  });
});
