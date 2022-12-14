import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';

import { render, screen, userEvent, waitFor } from '@/src/utils/test-utils';

import {
  DEFAULT_ERROR_MESSAGE,
  UPDATE_PASSWORD_SUCCESS_MESSAGE,
  ACCOUNT_DELETE_SUCCESS_MESSAGE,
  CANCEL_SUBSCRITION_SUCCESS_MESSAGE,
} from '@/src/utils/constants';

import Account from '@/src/pages/account';

jest.mock('@stripe/react-stripe-js', () => ({
  Elements: ({ children }) => <div>{children}</div>,
  PaymentElement: () => <div>MOCK PAYMENT ELEMENT</div>,
  useStripe: () => ({
    test: 'mock stripe',
    confirmPayment: () => ({ error: true }),
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

describe('Account Page', () => {
  beforeEach(() => {
    updateCtx = jest.fn();
    fetchMock.resetMocks();
  });

  describe('tabs', () => {
    it('renders', () => {
      render(<Account user={{ username: 'test-username' }} />);

      expect(
        screen.getByRole('button', { name: /submit/i })
      ).toBeInTheDocument();
    });

    it('redirects to login if no user found', () => {
      const { router } = render(<Account user={null} />, { push: jest.fn() });

      expect(router.push).toHaveBeenCalledWith('/login');
    });

    it('switches tabs', async () => {
      render(<Account user={{ subscriptionStatus: 'active' }} />);

      expect(
        screen.getByRole('button', { name: /submit/i })
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

      userEvent.click(screen.getByRole('tab', { name: /my subscription/i }));

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /cancel subscription/i })
        ).toBeInTheDocument();

        expect(screen.queryByText(message)).not.toBeInTheDocument();
      });
    });
  });

  describe('update subscription', () => {
    describe('unsubscribe', () => {
      it('unsubscribe success', async () => {
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

    describe('resubscribe', () => {
      it('resubscribe success', async () => {
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
  });

  describe('updatePassword', () => {
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

  describe('deleteAccount', () => {
    it('delete success', async () => {
      fetchMock.mockResponse(JSON.stringify({ resUser: null }));

      const updateCtx = jest.fn();

      const { router } = render(
        <Account user={{ username: 'John Smith' }} updateCtx={updateCtx} />,
        { push: jest.fn() }
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

      const { router } = render(<Account user={{ username: 'John Smith' }} />, {
        push: jest.fn(),
      });

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
        expect(router.push).not.toHaveBeenCalled();
      });
    });

    it('handles client error', async () => {
      fetchMock.mockResponse(() => {
        throw new Error();
      });

      const { router } = render(
        <Account user={{ username: 'John Smith' }} updateCtx={updateCtx} />,
        {
          push: jest.fn(),
        }
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
        expect(router.push).not.toHaveBeenCalled();
      });
    });
  });
});
