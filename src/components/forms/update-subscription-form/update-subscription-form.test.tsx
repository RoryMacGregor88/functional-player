import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import UpdateSubscriptionForm from './update-subscription-form.component';

jest.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => <div>{children}</div>,
  PaymentElement: () => <div>MOCK PAYMENT ELEMENT</div>,
  useStripe: () => ({ test: 'mock stripe' }),
  useElements: () => ({ test: 'mock elements' }),
}));

jest.mock('@/src/utils/get-stripe', () =>
  jest.fn().mockImplementation(() => () => {})
);

const renderComponent = ({
  subscriptionStatus = null,
  isLoading = false,
  clientSecret = null,
} = {}) => {
  const handleUnsubscribe = jest.fn(),
    handleStripeCustomer = jest.fn(),
    handleResubscribe = jest.fn();
  render(
    <UpdateSubscriptionForm
      subscriptionStatus={subscriptionStatus}
      isLoading={isLoading}
      handleUnsubscribe={handleUnsubscribe}
      handleStripeCustomer={handleStripeCustomer}
      handleResubscribe={handleResubscribe}
      clientSecret={clientSecret}
    />
  );

  return { handleUnsubscribe, handleStripeCustomer, handleResubscribe };
};

describe('UpdateSubscriptionForm', () => {
  it('renders', () => {
    renderComponent();
    expect(screen.getByText(/your subscription status:/i)).toBeInTheDocument();
  });

  describe('resubscribe form', () => {
    it('renders', () => {
      renderComponent({ clientSecret: '12345' });
      expect(
        screen.getByRole('button', { name: /submit/i })
      ).toBeInTheDocument();
    });

    it('shows loading spinner if isLoading is true and client secret is present', () => {
      renderComponent({ isLoading: true, clientSecret: '12345' });
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('calls submit handler with Stripe modules', async () => {
      const { handleResubscribe } = renderComponent({
        clientSecret: '12345',
      });

      userEvent.click(screen.getByRole('button', { name: /submit/i }));

      const expected = {
        stripe: { test: 'mock stripe' },
        elements: { test: 'mock elements' },
      };

      await waitFor(() => {
        expect(handleResubscribe).toHaveBeenCalledWith(expected);
      });
    });
  });

  describe('unsubscribe form', () => {
    it('renders', () => {
      renderComponent({ subscriptionStatus: 'active' });
      expect(screen.getByText(/cancel subscription/i)).toBeInTheDocument();
    });

    it('shows loading spinner if isLoading is true and subscription is active', () => {
      renderComponent({ isLoading: true, subscriptionStatus: 'active' });
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('calls handleUnsubscribe when button clicked', async () => {
      const { handleUnsubscribe } = renderComponent({
        subscriptionStatus: 'active',
      });

      userEvent.click(
        screen.getByRole('button', { name: /cancel subscription/i })
      );

      await waitFor(() => {
        expect(handleUnsubscribe).toHaveBeenCalled();
      });
    });
  });

  describe('stripe customer form', () => {
    it('shows re-enable button if subscription is not active', () => {
      renderComponent();

      expect(
        screen.getByRole('button', { name: /re-enable subscription/i })
      ).toBeInTheDocument();
    });

    it('shows loading spinner if isLoading is true and subscription is not active', () => {
      renderComponent({ isLoading: true });
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('calls handleStripeCustomer when button clicked', async () => {
      const { handleStripeCustomer } = renderComponent();

      userEvent.click(
        screen.getByRole('button', { name: /re-enable subscription/i })
      );

      await waitFor(() => {
        expect(handleStripeCustomer).toHaveBeenCalled();
      });
    });
  });
});
