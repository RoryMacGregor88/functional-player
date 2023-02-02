import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import { REACTIVATION_SUCCESS_MESSAGE } from '@/src/utils/constants';

import ReactivationSuccess from '@/src/pages/reactivation-success';

enableFetchMocks();

let user = null;
let updateCtx = null;

describe('Reactivation Success', () => {
  beforeEach(() => {
    fetchMock.resetMocks();

    user = { username: 'John Smith' };
    updateCtx = jest.fn();
  });

  it('shows success message, sets state, redirects on button click', async () => {
    fetchMock.mockResponse(JSON.stringify({ resUser: user }));

    const {
      router: { push },
    } = render(
      <ReactivationSuccess user={user} updateCtx={updateCtx} paymentIntent />,
      { push: jest.fn() }
    );

    await waitFor(() => {
      expect(
        screen.getByText(REACTIVATION_SUCCESS_MESSAGE)
      ).toBeInTheDocument();

      expect(updateCtx).toHaveBeenCalledWith({ user });
    });

    userEvent.click(
      screen.getByRole('button', { name: /return to dashboard/i })
    );

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('redirects to login if user is not found', () => {
    const {
      router: { push },
    } = render(<ReactivationSuccess user={null} paymentIntent={false} />, {
      push: jest.fn(),
    });

    expect(push).toHaveBeenCalledWith('/dashboard');
  });
});
