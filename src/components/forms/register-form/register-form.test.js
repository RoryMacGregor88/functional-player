import { render, screen, userEvent, waitFor } from "@/src/utils/test-utils";

import RegisterForm from "./register-form.component";

const renderComponent = ({
  disableSubmitButton = false,
  disableNextButton = false,
} = {}) => {
  const onSubmit = jest.fn(),
    onNextClick = jest.fn();

  const utils = render(
    <RegisterForm
      onSubmit={onSubmit}
      onNextClick={onNextClick}
      disableSubmitButton={disableSubmitButton}
      disableNextButton={disableNextButton}
    />
  );

  return {
    ...utils,
    onSubmit,
    onNextClick,
  };
};

describe("Register Form", () => {
  it("renders", () => {
    renderComponent();

    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /username/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /^password/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /^confirm password/i })
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("does not submit if form is invalid", async () => {
    const { onSubmit } = renderComponent();

    await userEvent.type(
      screen.getByRole("textbox", { name: /^email/i }),
      "test@email.com"
    );

    const submitButton = screen.getByRole("button", { name: /submit/i });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Username is required")).toBeInTheDocument();
      expect(screen.getByText("Password is required")).toBeInTheDocument();
      expect(
        screen.getByText("Password confirmation is required")
      ).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it("only allows passwords greater than minimum password length", async () => {
    const { onSubmit } = renderComponent();

    await userEvent.type(
      screen.getByRole("textbox", { name: /^password/i }),
      "test"
    );

    const submitButton = screen.getByRole("button", { name: /submit/i });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 5 characters")
      ).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it("only allows matching passwords", async () => {
    const { onSubmit } = renderComponent();

    await userEvent.type(
      screen.getByRole("textbox", { name: /^password/i }),
      "testpass"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /^confirm password/i }),
      "restpass2"
    );

    const submitButton = screen.getByRole("button", { name: /submit/i });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it("disables `Submit` button if disabled prop is passed", () => {
    renderComponent({ disableSubmitButton: true });
    expect(screen.getByRole("button", { name: /submit/i })).toBeDisabled();
  });

  it("disables `Next` button if disabled prop is passed", () => {
    renderComponent({ disableNextButton: true });
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  it("calls submit handler if form is valid and button is clicked", async () => {
    const { onSubmit } = renderComponent();

    await userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@email.com"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /username/i }),
      "test-username"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /^password/i }),
      "pass123"
    );

    await userEvent.type(
      screen.getByRole("textbox", { name: /^confirm password/i }),
      "pass123"
    );

    const expected = {
      email: "test@email.com",
      username: "test-username",
      password: "pass123",
      confirmPassword: "pass123",
    };

    await waitFor(() => {
      const submitButton = screen.getByRole("button", { name: /submit/i });

      expect(submitButton).toBeEnabled();
      userEvent.click(submitButton);
      expect(onSubmit).toHaveBeenCalledWith(expected);
    });
  });
});
