import SubscribeForm from './subscribe-form.component';

import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

jest.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => <div>{children}</div>,
  PaymentElement: () => <div>MOCK PAYMENT ELEMENT</div>,
  useStripe: () => ({ test: 'mock stripe' }),
  useElements: () => ({ test: 'mock elements' }),
}));

const renderComponent = ({ isLoading = false } = {}) => {
  const subscribeSubmit = jest.fn();
  render(
    <SubscribeForm subscribeSubmit={subscribeSubmit} isLoading={isLoading} />
  );
  return { subscribeSubmit };
};

describe('SubscriptionForm', () => {
  it('renders', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('shows loading spinner if isLoading is true', () => {
    renderComponent({ isLoading: true });
    expect(screen.getByTestId(/loading-spinner/i)).toBeInTheDocument();
  });

  it('calls submit handler with stripe elements', async () => {
    const { subscribeSubmit } = renderComponent();

    const expected = {
      stripe: { test: 'mock stripe' },
      elements: { test: 'mock elements' },
    };

    userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(subscribeSubmit).toHaveBeenCalledWith(expected);
    });
  });
});
