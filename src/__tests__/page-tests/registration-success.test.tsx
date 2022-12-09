import { render, screen } from '@/src/utils/test-utils';

import RegistrationSuccess from '@/src/pages/registration-success';

describe('registrationSuccess', () => {
  it('renders', () => {
    render(<RegistrationSuccess redirect={true} />);

    expect(
      screen.getByText(/thank you, your subscription was successful./i)
    ).toBeInTheDocument();
  });

  it('redirects to dashboard if user is found', () => {
    const { router } = render(
      <RegistrationSuccess user={{ username: 'John Smith' }} redirect={true} />,
      {
        push: jest.fn(),
      }
    );

    expect(router.push).toHaveBeenCalledWith('/dashboard');
  });

  it('redirects to dashboard if manually linked to (no redirect param)', () => {
    const { router } = render(
      <RegistrationSuccess
        user={{ username: 'John Smith' }}
        redirect={false}
      />,
      {
        push: jest.fn(),
      }
    );

    expect(router.push).toHaveBeenCalledWith('/dashboard');
  });
});
