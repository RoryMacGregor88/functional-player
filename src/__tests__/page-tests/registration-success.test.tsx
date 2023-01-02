import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import RegistrationSuccess from '@/src/pages/registration-success';

describe('Registration Success', () => {
  it('renders', () => {
    render(<RegistrationSuccess redirect={true} />);

    expect(
      screen.getByText(/thank you, your subscription was successful./i)
    ).toBeInTheDocument();
  });

  it('redirects to dashboard if manually linked to (redirect is false)', () => {
    const {
      router: { push },
    } = render(<RegistrationSuccess redirect={false} />, {
      push: jest.fn(),
    });

    expect(push).toHaveBeenCalledWith('/dashboard');
  });

  it('navigates to login', async () => {
    const {
      router: { push },
    } = render(<RegistrationSuccess redirect={true} />, {
      push: jest.fn(),
    });

    userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/login');
    });
  });
});
