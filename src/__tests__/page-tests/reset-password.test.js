import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

import {
  render,
  screen,
  userEvent,
  waitFor,
  DEFAULT_ERROR_MESSAGE,
} from "@/src/utils";

import ResetPassword from "@/src/pages/reset-password";

enableFetchMocks();

describe("ResetPassword", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("renders", () => {
    render(<ResetPassword user={null} />);

    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("redirects to dashboard if user is found", () => {
    const { router } = render(
      <ResetPassword user={{ username: "John Smith" }} />,
      { push: jest.fn() }
    );

    expect(router.push).toHaveBeenCalledWith("/dashboard");
  });

  it("shows success well and disabled button if successful", async () => {
    const testEmail = "test@email.com";
    fetchMock.mockResponse(JSON.stringify({ ok: true }));

    render(<ResetPassword user={null} />);

    await userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      testEmail
    );

    const submitButton = screen.getByRole("button", { name: /submit/i });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          `An email has been sent to ${testEmail}. Please follow the steps to reset your password. Don't forget to check your junk folder.`
        )
      );
      expect(submitButton).toBeDisabled();
    });
  });

  it("handles server error", async () => {
    const message = "test-error-message";
    fetchMock.mockResponse(JSON.stringify({ error: { message } }));

    render(<ResetPassword user={null} />);

    await userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@email.com"
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

    render(<ResetPassword user={null} />);

    await userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@email.com"
    );

    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(DEFAULT_ERROR_MESSAGE)).toBeInTheDocument();
    });
  });
});