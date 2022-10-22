import {
  render,
  screen,
  userEvent,
  waitFor,
  fetchMock,
  enableFetchMocks,
  DEFAULT_ERROR_MESSAGE,
  PASSWORD_UPDATE_SUCCESS_MESSAGE,
  ACCOUNT_DELETE_SUCCESS_MESSAGE,
} from "@/src/utils";

import Account from "@/src/pages/account";

enableFetchMocks();

describe("Account Page", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  describe("tabs", () => {
    it("renders", () => {
      render(<Account user={{ username: "test-username" }} />);

      expect(
        screen.getByRole("button", { name: /submit/i })
      ).toBeInTheDocument();
    });

    it("redirects to login if no user found", () => {
      const { router } = render(<Account user={null} />);

      expect(router.push).toHaveBeenCalledWith("/login");
    });

    it("switches tabs", async () => {
      render(<Account user={{ subscriptionStatus: "active" }} />);

      expect(
        screen.getByRole("button", { name: /submit/i })
      ).toBeInTheDocument();

      userEvent.click(screen.getByRole("tab", { name: /my subscription/i }));

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /cancel subscription/i })
        ).toBeInTheDocument();
      });
    });

    it("closes well when tab switched", async () => {
      fetchMock.mockResponse(() => {
        throw new Error();
      });

      render(<Account user={{ subscriptionStatus: "active" }} />);

      userEvent.click(screen.getByRole("tab", { name: /update password/i }));

      await waitFor(() => {
        expect(
          screen.getByRole("textbox", { name: /current password/i })
        ).toBeInTheDocument();
      });
      await userEvent.type(
        screen.getByRole("textbox", { name: /current password/i }),
        "oldpassword"
      );
      await userEvent.type(
        screen.getByRole("textbox", { name: /^new password/i }),
        "newpassword"
      );
      await userEvent.type(
        screen.getByRole("textbox", { name: /confirm new password/i }),
        "newpassword"
      );

      userEvent.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(DEFAULT_ERROR_MESSAGE)).toBeInTheDocument();
      });

      userEvent.click(screen.getByRole("tab", { name: /my subscription/i }));

      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /cancel subscription/i })
        ).toBeInTheDocument();
        expect(
          screen.queryByText(DEFAULT_ERROR_MESSAGE)
        ).not.toBeInTheDocument();
      });
    });
  });

  //TODO: remove update email? It's maybe too much hassle to allow (stripe)
  describe("updateEmail", () => {
    it("email success", () => {});
    it("email server error", () => {});
    it("email client error", () => {});
  });

  describe("updatePassword", () => {
    it("renders success well", async () => {
      fetchMock.mockResponse(JSON.stringify({ ok: true }));

      render(<Account user={{ username: "John Smith" }} />);

      userEvent.click(screen.getByRole("tab", { name: /update password/i }));

      await waitFor(() => {
        expect(
          screen.getByRole("textbox", { name: /current password/i })
        ).toBeInTheDocument();
      });
      await userEvent.type(
        screen.getByRole("textbox", { name: /current password/i }),
        "oldpassword"
      );
      await userEvent.type(
        screen.getByRole("textbox", { name: /^new password/i }),
        "newpassword"
      );
      await userEvent.type(
        screen.getByRole("textbox", { name: /confirm new password/i }),
        "newpassword"
      );

      userEvent.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(
          screen.getByText(PASSWORD_UPDATE_SUCCESS_MESSAGE)
        ).toBeInTheDocument();
      });
    });

    it("handles server error", async () => {
      const message = "test-error-message";
      fetchMock.mockResponse(JSON.stringify({ error: { message } }));

      render(<Account user={{ username: "John Smith" }} />);

      userEvent.click(screen.getByRole("tab", { name: /update password/i }));

      await waitFor(() => {
        expect(
          screen.getByRole("textbox", { name: /current password/i })
        ).toBeInTheDocument();
      });
      await userEvent.type(
        screen.getByRole("textbox", { name: /current password/i }),
        "oldpassword"
      );
      await userEvent.type(
        screen.getByRole("textbox", { name: /^new password/i }),
        "newpassword"
      );
      await userEvent.type(
        screen.getByRole("textbox", { name: /confirm new password/i }),
        "newpassword"
      );

      userEvent.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(message)).toBeInTheDocument();
      });
    });

    it("handles client error", async () => {
      fetchMock.mockResponse(() => {
        throw new Error();
      });

      render(<Account user={{ username: "John Smith" }} />);

      userEvent.click(screen.getByRole("tab", { name: /update password/i }));

      await waitFor(() => {
        expect(
          screen.getByRole("textbox", { name: /current password/i })
        ).toBeInTheDocument();
      });
      await userEvent.type(
        screen.getByRole("textbox", { name: /current password/i }),
        "oldpassword"
      );
      await userEvent.type(
        screen.getByRole("textbox", { name: /^new password/i }),
        "newpassword"
      );
      await userEvent.type(
        screen.getByRole("textbox", { name: /confirm new password/i }),
        "newpassword"
      );

      userEvent.click(screen.getByRole("button", { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(DEFAULT_ERROR_MESSAGE)).toBeInTheDocument();
      });
    });
  });

  // TODO: bother with stripe testing?

  describe("deleteAccount", () => {
    it("delete success", async () => {
      fetchMock.mockResponse(JSON.stringify({ resUser: {} }));

      const updateCtx = jest.fn();

      const { router } = render(
        <Account user={{ username: "John Smith" }} updateCtx={updateCtx} />
      );

      userEvent.click(screen.getByRole("tab", { name: /delete account/i }));

      await waitFor(() => {
        const proceedButton = screen.getByRole("button", { name: /proceed/i });
        expect(proceedButton).toBeInTheDocument();
        userEvent.click(proceedButton);
      });

      await waitFor(() => {
        const deleteButton = screen.getByRole("button", {
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
        expect(router.push).toHaveBeenCalledWith("/");
      });
    });

    it("handles server error", async () => {
      const message = "test-error-message";
      fetchMock.mockResponse(JSON.stringify({ error: { message } }));

      const { router } = render(<Account user={{ username: "John Smith" }} />);

      userEvent.click(screen.getByRole("tab", { name: /delete account/i }));

      await waitFor(() => {
        const proceedButton = screen.getByRole("button", { name: /proceed/i });
        expect(proceedButton).toBeInTheDocument();
        userEvent.click(proceedButton);
      });

      await waitFor(() => {
        const deleteButton = screen.getByRole("button", {
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

    it("handler client error", async () => {
      fetchMock.mockResponse(() => {
        throw new Error();
      });

      const { router } = render(<Account user={{ username: "John Smith" }} />);

      userEvent.click(screen.getByRole("tab", { name: /delete account/i }));

      await waitFor(() => {
        const proceedButton = screen.getByRole("button", { name: /proceed/i });
        expect(proceedButton).toBeInTheDocument();
        userEvent.click(proceedButton);
      });

      await waitFor(() => {
        const deleteButton = screen.getByRole("button", {
          name: /permanently delete my account/i,
        });
        expect(deleteButton).toBeInTheDocument();
        userEvent.click(deleteButton);
      });

      await waitFor(() => {
        expect(screen.getByText(DEFAULT_ERROR_MESSAGE)).toBeInTheDocument();
        expect(router.push).not.toHaveBeenCalled();
      });
    });
  });
});
