import Navbar from './navbar.component';

import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

describe('Navbar', () => {
  it('renders', () => {
    render(<Navbar />);

    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
  });

  it('opens drawer when icon clicked', async () => {
    const setIsDrawerOpen = jest.fn();
    render(<Navbar setIsDrawerOpen={setIsDrawerOpen} />);

    userEvent.click(screen.getByTestId(/menu-icon/i));

    await waitFor(() => {
      expect(setIsDrawerOpen).toHaveBeenCalled();
    });
  });

  it('closes drawer when icon clicked', async () => {
    const setIsDrawerOpen = jest.fn();
    render(<Navbar setIsDrawerOpen={setIsDrawerOpen} isDrawerOpen />);

    userEvent.click(screen.getByTestId(/menu-icon/i));

    await waitFor(() => {
      expect(setIsDrawerOpen).toHaveBeenCalled();
    });
  });

  it('navigates to dashboard if logo clicked', async () => {
    const {
      router: { push },
    } = render(<Navbar isDrawerOpen={false} />, {
      push: jest.fn(),
    });

    userEvent.click(screen.getByTestId(/fp-logo/i));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/dashboard', {
        forceOptimisticNavigation: false,
      });
    });
  });

  it('updates state and navigates to route when select changed', async () => {
    const {
      updateCtx,
      router: { push },
    } = render(<Navbar isDrawerOpen={false} />, {
      push: jest.fn(),
      updateCtx: jest.fn(),
    });

    userEvent.click(screen.getAllByLabelText('Explore by category...')[1]);

    await waitFor(() => {
      userEvent.click(screen.getByText(/blues/i));
    });

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith({ selectedCategory: 'blues' });
      expect(push).toHaveBeenCalledWith('/categories/?category=blues');
    });
  });

  it('navigates to login when button clicked', async () => {
    const {
      router: { push },
    } = render(<Navbar isDrawerOpen={false} />, {
      push: jest.fn(),
    });

    userEvent.click(screen.getByRole('button', { name: 'Log in' }));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/login', {
        forceOptimisticNavigation: false,
      });
    });
  });

  it('navigates to register when button clicked', async () => {
    const {
      router: { push },
    } = render(<Navbar isDrawerOpen={false} />, {
      push: jest.fn(),
    });

    userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/register', {
        forceOptimisticNavigation: false,
      });
    });
  });
});
