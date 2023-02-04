import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import {
  DEFAULT_ERROR_MESSAGE,
  UPDATE_PASSWORD_SUCCESS_MESSAGE,
  ACCOUNT_DELETE_SUCCESS_MESSAGE,
  CANCEL_SUBSCRITION_SUCCESS_MESSAGE,
  LOGIN_REQUIRED_MESSAGE,
} from '@/src/utils/constants';

import Account from '@/src/pages/account';

jest.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => <div>{children}</div>,
  PaymentElement: () => <div>MOCK PAYMENT ELEMENT</div>,
  useStripe: () => ({
    confirmPayment: () => ({ error: { message: 'stripe-error-message' } }),
  }),
  useElements: () => ({ test: 'mock elements' }),
}));

jest.mock('@/src/utils/get-stripe', () =>
  jest.fn().mockImplementation(() => () => {})
);

enableFetchMocks();

const toastData = {
  toastData: {
    severity: 'error',
    message: DEFAULT_ERROR_MESSAGE,
  },
};

let updateCtx = null;

describe('Account', () => {
  beforeEach(() => {
    updateCtx = jest.fn();
    fetchMock.resetMocks();
  });

  describe('Tabs', () => {
    it('renders', () => {
      render(<Account user={{ username: 'test-username' }} />);

      expect(
        screen.getByRole('textbox', { name: /current password/i })
      ).toBeInTheDocument();
    });

    it('redirects to login if no user found', () => {
      const updateCtx = jest.fn();
      const {
        router: { push },
      } = render(
        <Account user={null} ctx={{ toastData: null }} updateCtx={updateCtx} />,
        {
          push: jest.fn(),
        }
      );

      expect(push).toHaveBeenCalledWith('/login');
      expect(updateCtx).toHaveBeenCalledWith({
        toastData: {
          severity: 'error',
          message: LOGIN_REQUIRED_MESSAGE,
        },
      });
    });

    it('does not call updateCtx if already toastData in state', () => {
      const updateCtx = jest.fn(),
        ctx = { toastData: { message: 'test-toast-message' } };

      const {
        router: { push },
      } = render(<Account user={null} ctx={ctx} updateCtx={updateCtx} />, {
        push: jest.fn(),
      });

      expect(push).toHaveBeenCalledWith('/login');
      expect(updateCtx).not.toHaveBeenCalled();
    });

    it('switches tabs', async () => {
      render(<Account user={{ subscriptionStatus: 'active' }} />);

      expect(
        screen.getByRole('textbox', { name: /current password/i })
      ).toBeInTheDocument();

      userEvent.click(screen.getByRole('tab', { name: /my subscription/i }));

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /cancel subscription/i })
        ).toBeInTheDocument();
      });
    });

    it('closes well when tab switched', async () => {
      const message = 'test-error-message';
      fetchMock.mockResponse(JSON.stringify({ error: { message } }));

      render(<Account user={{ subscriptionStatus: 'active' }} />);

      await waitFor(() => {
        expect(
          screen.getByRole('textbox', { name: /current password/i })
        ).toBeInTheDocument();
      });

      await userEvent.type(
        screen.getByRole('textbox', { name: /current password/i }),
        'oldpassword'
      );
      await userEvent.type(
        screen.getByRole('textbox', { name: /^new password/i }),
        'newpassword'
      );
      await userEvent.type(
        screen.getByRole('textbox', { name: /confirm new password/i }),
        'newpassword'
      );

      userEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(message)).toBeInTheDocument();
      });

      userEvent.click(screen.getByRole('tab', { name: /my subscription/i }));

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /cancel subscription/i })
        ).toBeInTheDocument();

        expect(screen.queryByText(message)).not.toBeInTheDocument();
      });
    });
  });

  describe('Update Subscription', () => {
    describe('Unsubscribe', () => {
      it('unsubscribes', async () => {
        const resUser = { subscriptionStatus: null, subscriptionId: null };

        fetchMock.mockResponse(JSON.stringify({ resUser }));

        render(
          <Account
            user={{ subscriptionStatus: 'active' }}
            updateCtx={updateCtx}
          />
        );

        userEvent.click(screen.getByRole('tab', { name: /my subscription/i }));

        await waitFor(() => {
          expect(
            screen.getByRole('button', {
              name: /cancel subscription/i,
            })
          ).toBeInTheDocument();
        });

        userEvent.click(
          screen.getByRole('button', {
            name: /cancel subscription/i,
          })
        );

        await waitFor(() => {
          expect(
            screen.getByText(CANCEL_SUBSCRITION_SUCCESS_MESSAGE)
          ).toBeInTheDocument();

          expect(updateCtx).toHaveBeenCalledWith({ user: resUser });
        });
      });

      it('handles server error', async () => {
        const message = 'test-error-message';

        fetchMock.mockResponse(JSON.stringify({ error: { message } }));

        render(<Account user={{ subscriptionStatus: 'active' }} />);

        userEvent.click(screen.getByRole('tab', { name: /my subscription/i }));

        await waitFor(() => {
          expect(
            screen.getByRole('button', {
              name: /cancel subscription/i,
            })
          ).toBeInTheDocument();
        });

        userEvent.click(
          screen.getByRole('button', {
            name: /cancel subscription/i,
          })
        );

        await waitFor(() => {
          expect(screen.getByText(message)).toBeInTheDocument();
        });
      });

      it('handles client error', async () => {
        fetchMock.mockResponse(() => {
          throw new Error();
        });

        render(
          <Account
            user={{ subscriptionStatus: 'active' }}
            updateCtx={updateCtx}
          />
        );

        userEvent.click(screen.getByRole('tab', { name: /my subscription/i }));

        await waitFor(() => {
          expect(
            screen.getByRole('button', {
              name: /cancel subscription/i,
            })
          ).toBeInTheDocument();
        });

        userEvent.click(
          screen.getByRole('button', {
            name: /cancel subscription/i,
          })
        );

        await waitFor(() => {
          expect(updateCtx).toHaveBeenCalledWith(toastData);
        });
      });
    });

    describe('Create Stripe Customer', () => {
      it('creates stripe customer', async () => {
        fetchMock.mockResponse(
          JSON.stringify({
            clientSecret: '12345',
            resUser: {
              suscriptionId: '12345',
              subscriptionStatus: 'incomplete',
            },
          })
        );

        render(
          <Account user={{ subscriptionStatus: null }} updateCtx={updateCtx} />
        );

        userEvent.click(screen.getByRole('tab', { name: /my subscription/i }));

        await waitFor(() => {
          expect(
            screen.getByRole('button', {
              name: /re-enable subscription/i,
            })
          ).toBeInTheDocument();
        });

        userEvent.click(
          screen.getByRole('button', {
            name: /re-enable subscription/i,
          })
        );

        await waitFor(() => {
          expect(
            screen.getByRole('button', {
              name: /submit/i,
            })
          ).toBeInTheDocument();
        });
      });

      it('handles server error', async () => {
        const message = 'test-error-message';
        fetchMock.mockResponse(JSON.stringify({ error: { message } }));

        render(
          <Account user={{ subscriptionStatus: null }} updateCtx={updateCtx} />
        );

        userEvent.click(screen.getByRole('tab', { name: /my subscription/i }));

        await waitFor(() => {
          expect(
            screen.getByRole('button', {
              name: /re-enable subscription/i,
            })
          ).toBeInTheDocument();
        });

        userEvent.click(
          screen.getByRole('button', {
            name: /re-enable subscription/i,
          })
        );

        await waitFor(() => {
          expect(screen.getByText(message)).toBeInTheDocument();
        });
      });

      it('handles client error', async () => {
        fetchMock.mockResponse(() => {
          throw new Error();
        });

        render(
          <Account user={{ subscriptionStatus: null }} updateCtx={updateCtx} />
        );

        userEvent.click(screen.getByRole('tab', { name: /my subscription/i }));

        await waitFor(() => {
          expect(
            screen.getByRole('button', {
              name: /re-enable subscription/i,
            })
          ).toBeInTheDocument();
        });

        userEvent.click(
          screen.getByRole('button', {
            name: /re-enable subscription/i,
          })
        );

        await waitFor(() => {
          expect(updateCtx).toHaveBeenCalledWith(toastData);
        });
      });
    });

    describe('Resubscribe', () => {
      it('handles stripe error', async () => {
        fetchMock.mockResponse(
          JSON.stringify({
            clientSecret: '12345',
            resUser: {
              suscriptionId: '12345',
              subscriptionStatus: 'incomplete',
            },
          })
        );

        render(
          <Account user={{ subscriptionStatus: null }} updateCtx={updateCtx} />
        );

        userEvent.click(screen.getByRole('tab', { name: /my subscription/i }));

        await waitFor(() => {
          expect(
            screen.getByRole('button', {
              name: /re-enable subscription/i,
            })
          ).toBeInTheDocument();
        });

        userEvent.click(
          screen.getByRole('button', {
            name: /re-enable subscription/i,
          })
        );

        await waitFor(() => {
          expect(
            screen.getByRole('button', {
              name: /submit/i,
            })
          ).toBeInTheDocument();
        });

        userEvent.click(
          screen.getByRole('button', {
            name: /submit/i,
          })
        );

        await waitFor(() => {
          expect(screen.getByText(/stripe-error-message/i)).toBeInTheDocument();
        });
      });
    });
  });

  describe('Update Password', () => {
    it('renders success well', async () => {
      fetchMock.mockResponse(JSON.stringify({ ok: true }));

      render(<Account user={{ username: 'John Smith' }} />);

      userEvent.click(screen.getByRole('tab', { name: /update password/i }));

      await waitFor(() => {
        expect(
          screen.getByRole('textbox', { name: /current password/i })
        ).toBeInTheDocument();
      });
      await userEvent.type(
        screen.getByRole('textbox', { name: /current password/i }),
        'oldpassword'
      );
      await userEvent.type(
        screen.getByRole('textbox', { name: /^new password/i }),
        'newpassword'
      );
      await userEvent.type(
        screen.getByRole('textbox', { name: /confirm new password/i }),
        'newpassword'
      );

      userEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(
          screen.getByText(UPDATE_PASSWORD_SUCCESS_MESSAGE)
        ).toBeInTheDocument();
      });
    });

    it('handles server error', async () => {
      const message = 'test-error-message';
      fetchMock.mockResponse(JSON.stringify({ error: { message } }));

      render(<Account user={{ username: 'John Smith' }} />);

      userEvent.click(screen.getByRole('tab', { name: /update password/i }));

      await waitFor(() => {
        expect(
          screen.getByRole('textbox', { name: /current password/i })
        ).toBeInTheDocument();
      });
      await userEvent.type(
        screen.getByRole('textbox', { name: /current password/i }),
        'oldpassword'
      );
      await userEvent.type(
        screen.getByRole('textbox', { name: /^new password/i }),
        'newpassword'
      );
      await userEvent.type(
        screen.getByRole('textbox', { name: /confirm new password/i }),
        'newpassword'
      );

      userEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(message)).toBeInTheDocument();
      });
    });

    it('handles client error', async () => {
      fetchMock.mockResponse(() => {
        throw new Error();
      });

      render(
        <Account user={{ username: 'John Smith' }} updateCtx={updateCtx} />
      );

      userEvent.click(screen.getByRole('tab', { name: /update password/i }));

      await waitFor(() => {
        expect(
          screen.getByRole('textbox', { name: /current password/i })
        ).toBeInTheDocument();
      });
      await userEvent.type(
        screen.getByRole('textbox', { name: /current password/i }),
        'oldpassword'
      );
      await userEvent.type(
        screen.getByRole('textbox', { name: /^new password/i }),
        'newpassword'
      );
      await userEvent.type(
        screen.getByRole('textbox', { name: /confirm new password/i }),
        'newpassword'
      );

      userEvent.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(updateCtx).toHaveBeenCalledWith(toastData);
      });
    });
  });

  describe('Delete Account', () => {
    it('deletes account', async () => {
      fetchMock.mockResponse(JSON.stringify({ resUser: null }));

      const updateCtx = jest.fn();

      render(
        <Account user={{ username: 'John Smith' }} updateCtx={updateCtx} />
      );

      userEvent.click(screen.getByRole('tab', { name: /delete account/i }));

      await waitFor(() => {
        expect(
          screen.getByRole('textbox', { name: /password/i })
        ).toBeInTheDocument();
      });

      await userEvent.type(
        screen.getByRole('textbox', { name: /password/i }),
        'password123'
      );

      userEvent.click(screen.getByRole('button', { name: /proceed/i }));

      await waitFor(() => {
        const deleteButton = screen.getByRole('button', {
          name: /permanently delete my account/i,
        });
        expect(deleteButton).toBeInTheDocument();
        userEvent.click(deleteButton);
      });

      await waitFor(() => {
        expect(
          screen.getByText(ACCOUNT_DELETE_SUCCESS_MESSAGE)
        ).toBeInTheDocument();
        expect(updateCtx).toHaveBeenCalledWith({ user: null });
      });
    });

    it('handles server error', async () => {
      const message = 'test-error-message';
      fetchMock.mockResponse(JSON.stringify({ error: { message } }));

      render(<Account user={{ username: 'John Smith' }} />);

      userEvent.click(screen.getByRole('tab', { name: /delete account/i }));

      await waitFor(() => {
        expect(
          screen.getByRole('textbox', { name: /password/i })
        ).toBeInTheDocument();
      });

      await userEvent.type(
        screen.getByRole('textbox', { name: /password/i }),
        'password123'
      );

      userEvent.click(screen.getByRole('button', { name: /proceed/i }));

      await waitFor(() => {
        const deleteButton = screen.getByRole('button', {
          name: /permanently delete my account/i,
        });
        expect(deleteButton).toBeInTheDocument();
        userEvent.click(deleteButton);
      });

      await waitFor(() => {
        expect(screen.getByText(message)).toBeInTheDocument();
      });
    });

    it('handles client error', async () => {
      fetchMock.mockResponse(() => {
        throw new Error();
      });

      render(
        <Account user={{ username: 'John Smith' }} updateCtx={updateCtx} />
      );

      userEvent.click(screen.getByRole('tab', { name: /delete account/i }));

      await waitFor(() => {
        expect(
          screen.getByRole('textbox', { name: /password/i })
        ).toBeInTheDocument();
      });

      await userEvent.type(
        screen.getByRole('textbox', { name: /password/i }),
        'password123'
      );

      userEvent.click(screen.getByRole('button', { name: /proceed/i }));

      await waitFor(() => {
        const deleteButton = screen.getByRole('button', {
          name: /permanently delete my account/i,
        });
        expect(deleteButton).toBeInTheDocument();
        userEvent.click(deleteButton);
      });

      await waitFor(() => {
        expect(updateCtx).toHaveBeenCalledWith(toastData);
      });
    });
  });
});
