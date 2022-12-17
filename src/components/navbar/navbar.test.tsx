import Navbar from './navbar.component';

import { DEFAULT_SELECT_OPTION } from '@/src/utils/constants';

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
    render(<Navbar setIsDrawerOpen={setIsDrawerOpen} isDrawerOpen={true} />);

    userEvent.click(screen.getByTestId(/menu-icon/i));

    await waitFor(() => {
      expect(setIsDrawerOpen).toHaveBeenCalled();
    });
  });

  it('resets category and closes drawer (if open) if logo clicked', async () => {
    const setIsDrawerOpen = jest.fn();
    const { updateCtx } = render(
      <Navbar setIsDrawerOpen={setIsDrawerOpen} isDrawerOpen={true} />,
      { updateCtx: jest.fn() }
    );

    userEvent.click(screen.getByText(/functional player/i));

    const expected = {
      selectedCategory: DEFAULT_SELECT_OPTION,
    };

    await waitFor(() => {
      expect(updateCtx).toHaveBeenCalledWith(expected);
      expect(setIsDrawerOpen).toHaveBeenCalled();
    });
  });

  it('does not call drawer close fn if drawer is closed and logo clicked', async () => {
    const setIsDrawerOpen = jest.fn();
    render(<Navbar setIsDrawerOpen={setIsDrawerOpen} isDrawerOpen={false} />);

    userEvent.click(screen.getByText(/functional player/i));

    await waitFor(() => {
      expect(setIsDrawerOpen).not.toHaveBeenCalled();
    });
  });

  it('navigates to dashboard if logo clicked', async () => {
    const {
      router: { push },
    } = render(<Navbar isDrawerOpen={false} />, {
      push: jest.fn(),
    });

    userEvent.click(screen.getByText(/functional player/i));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/dashboard', {
        forceOptimisticNavigation: false,
      });
    });
  });
});
