import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import UpdateSubscriptionForm from './update-subscription-form.component';

describe('UpdateSubscriptionForm', () => {
  it('renders', () => {
    render(<UpdateSubscriptionForm subscriptionStatus='active' />);

    expect(screen.getByText(/cancel subscription/i)).toBeInTheDocument();
  });

  it('shows re-enable button if subscription is not active', () => {
    render(<UpdateSubscriptionForm subscriptionStatus={null} />);

    expect(
      screen.getByRole('button', { name: /re-enable subscription/i })
    ).toBeInTheDocument();
  });

  it('shows loading spinner if loading is true', () => {
    render(<UpdateSubscriptionForm isLoading={true} />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('calls handleUnsubscribe when button clicked', async () => {
    const handleUnsubscribe = jest.fn();
    render(
      <UpdateSubscriptionForm
        subscriptionStatus='active'
        handleUnsubscribe={handleUnsubscribe}
      />
    );

    userEvent.click(
      screen.getByRole('button', { name: /cancel subscription/i })
    );

    await waitFor(() => {
      expect(handleUnsubscribe).toHaveBeenCalled();
    });
  });

  it('calls handleStripeCustomer when button clicked', async () => {
    const handleStripeCustomer = jest.fn();
    render(
      <UpdateSubscriptionForm
        subscriptionStatus={null}
        handleStripeCustomer={handleStripeCustomer}
      />
    );

    userEvent.click(
      screen.getByRole('button', { name: /re-enable subscription/i })
    );

    await waitFor(() => {
      expect(handleStripeCustomer).toHaveBeenCalled();
    });
  });
});
