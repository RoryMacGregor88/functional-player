import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import RegistrationSuccess from '@/src/pages/registration-success';

import { PAGE_CANNOT_BE_ACCESSED_MESSAGE } from '@/src/utils/constants';

describe('Registration Success', () => {
  it('renders', () => {
    render(<RegistrationSuccess hasPaymentIntent />);

    expect(
      screen.getByText(/thank you, your subscription was successful./i)
    ).toBeInTheDocument();
  });

  it('redirects to dashboard if manually linked to (hasPaymentIntent is false)', () => {
    const updateCtx = jest.fn();

    const {
      router: { push },
    } = render(
      <RegistrationSuccess updateCtx={updateCtx} hasPaymentIntent={false} />,
      {
        push: jest.fn(),
      }
    );

    expect(push).toHaveBeenCalledWith('/dashboard');
    expect(updateCtx).toHaveBeenCalledWith({
      toastData: {
        severity: 'error',
        message: PAGE_CANNOT_BE_ACCESSED_MESSAGE,
      },
    });
  });

  it('navigates to login', async () => {
    const {
      router: { push },
    } = render(<RegistrationSuccess hasPaymentIntent />, {
      push: jest.fn(),
    });

    userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/login');
    });
  });
});
