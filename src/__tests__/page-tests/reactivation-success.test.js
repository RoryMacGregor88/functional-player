import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import { REACTIVATION_SUCCESS_MESSAGE } from '@/src/utils/constants';

import ReactivationSuccess from '@/src/pages/reactivation-success';

enableFetchMocks();

describe('Reactivation success page', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('shows success message, sets state, redirects on button click', async () => {
    const user = { username: 'John Smith' },
      updateCtx = jest.fn();

    fetchMock.mockResponse(JSON.stringify({ resUser: user }));

    const { router } = render(
      <ReactivationSuccess user={user} updateCtx={updateCtx} />,
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
      expect(router.push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('redirects to login if user is not found', () => {
    const { router } = render(<ReactivationSuccess user={null} />, {
      push: jest.fn(),
    });

    expect(router.push).toHaveBeenCalledWith('/login');
  });
});
