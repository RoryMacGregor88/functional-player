import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import AccountDetails from './account-details.component';

let handleLogoutFromAllClick = null;

describe('Account Details', () => {
  beforeEach(() => {
    handleLogoutFromAllClick = jest.fn();
  });

  it('renders', () => {
    render(<AccountDetails />);

    expect(
      screen.getByText(/below is a sumary of your account:/i)
    ).toBeInTheDocument();
  });

  it('calls handleLogoutFromAllClick when button clicked', async () => {
    render(
      <AccountDetails handleLogoutFromAllClick={handleLogoutFromAllClick} />
    );

    userEvent.click(
      screen.getByRole('button', { name: /log out from all devices/i })
    );

    await waitFor(() => {
      expect(handleLogoutFromAllClick).toHaveBeenCalled();
    });
  });
});
