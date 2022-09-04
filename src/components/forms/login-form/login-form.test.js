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

  it("blocks non-emails in email field", async () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "not-a-valid-email"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /password/i }),
      "test-password123"
    );

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(EMAIL_INVALID_MESSAGE)).toBeInTheDocument();
  });

  it("disables submit button if form is invalid", async () => {
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(EMAIL_REQUIRED_MESSAGE)).toBeInTheDocument();
      expect(screen.getByText(PASSWORD_REQUIRED_MESSAGE)).toBeInTheDocument();
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmit when form is valid and button is clicked", async () => {
    fetchMock.mockResponse(JSON.stringify({}));

    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    const TEST_EMAIL = "test@email.com";
    const TEST_PASSWORD = "testpassword123";

    await userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      TEST_EMAIL
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /password/i }),
      TEST_PASSWORD
    );

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });
  });
});
