import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

import { render, screen, userEvent, waitFor } from "@/src/utils/test-utils";

import {
  EMAIL_REQUIRED_MESSAGE,
  EMAIL_INVALID_MESSAGE,
  PASSWORD_REQUIRED_MESSAGE,
} from "@/src/utils";

import LoginForm from "./login-form.component";

enableFetchMocks();

describe("Login Form", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("renders", () => {
    render(<LoginForm />);

    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /password/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("disables submit button if form is invalid", async () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(EMAIL_REQUIRED_MESSAGE)).toBeInTheDocument();
      expect(screen.getByText(PASSWORD_REQUIRED_MESSAGE)).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it.only("blocks non-emails in email field", async () => {
    // TODO: same here, only types first characer

    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    const TEST_EMAIL = "testemail";
    const TEST_PASSWORD = "testpassword123";

    userEvent.type(screen.getByRole("textbox", { name: /email/i }), TEST_EMAIL);
    userEvent.type(
      screen.getByRole("textbox", { name: /password/i }),
      TEST_PASSWORD
    );

    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(onSubmit).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText(EMAIL_INVALID_MESSAGE)).toBeInTheDocument();
    });
  });

  it("submits form when form is valid and button is clicked", async () => {
    fetchMock.mockResponse(JSON.stringify({}));

    // TODO: broken, only types first character into field

    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    const TEST_EMAIL = "test@email.com";
    const TEST_PASSWORD = "testpassword123";

    waitFor(() => {
      userEvent.type(screen.getByRole("textbox", { name: /email/i }), "pat");
      userEvent.type(
        screen.getByRole("textbox", { name: /password/i }),
        "crab"
      );
    });

    userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });
    });
  });
});
