import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import AccountDetails from './account-details.component';

const defaultCtx = { user: { creationDate: new Date().toISOString() } };

let handleLogoutFromAllClick = null;

describe('Account Details', () => {
  beforeEach(() => {
    handleLogoutFromAllClick = jest.fn();
  });

  it('renders', () => {
    render(<AccountDetails />, { ctx: defaultCtx });

    expect(
      screen.getByText(/below is a summary of your account:/i)
    ).toBeInTheDocument();
  });

  it('calls handleLogoutFromAllClick when button clicked', async () => {
    render(
      <AccountDetails handleLogoutFromAllClick={handleLogoutFromAllClick} />,
      { ctx: defaultCtx }
    );

    userEvent.click(
      screen.getByRole('button', { name: /log out from all devices/i })
    );

    await waitFor(() => {
      expect(handleLogoutFromAllClick).toHaveBeenCalled();
    });
  });
});
