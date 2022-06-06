import { render, screen, userEvent, waitFor } from "@/src/utils/test-utils";

import RegisterForm from "./register-form.component";

const renderComponent = ({ disableNextButton = false } = {}) => {
  const setClientSecret = jest.fn(),
    onNextClick = jest.fn(),
    setWellData = jest.fn();

  const utils = render(
    <RegisterForm
      setClientSecret={setClientSecret}
      onNextClick={onNextClick}
      setWellData={setWellData}
      disableNextButton={disableNextButton}
    />
  );

  return {
    ...utils,
    setClientSecret,
    onNextClick,
    setWellData,
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
    const { registerSubmit } = renderComponent();

    userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "email@test.com"
    );

    const submitButton = screen.getByRole("button", { name: /submit/i });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Username is required")).toBeInTheDocument();
      expect(registerSubmit).not.toHaveBeenCalled();
    });
  });

  it("only allows passwords greater than minimum password length", async () => {
    const { registerSubmit } = renderComponent();

    userEvent.type(screen.getByRole("textbox", { name: /^password/i }), "123");

    const submitButton = screen.getByRole("button", { name: /submit/i });
    userEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Password is too short (minimum 5 characters)")
      ).toBeInTheDocument();
      expect(registerSubmit).not.toHaveBeenCalled();
    });
  });

  it("only allows matching passwords", () => {
    const { registerSubmit } = renderComponent();

    userEvent.type(screen.getByRole("textbox", { name: /^password/i }), "123");

    userEvent.type(
      screen.getByRole("textbox", { name: /^confirm password/i }),
      "456"
    );

    expect(
      screen.getByText("Password and password confirmation do not match")
    ).toBeInTheDocument();

    expect(registerSubmit).not.toHaveBeenCalled();
  });

  it("calls submit handler if form is valid and button is clicked", async () => {
    const { registerSubmit, setClientSecret } = renderComponent();

    userEvent.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@email.com"
    );

    userEvent.type(
      screen.getByRole("textbox", { name: /username/i }),
      "test-username"
    );

    userEvent.type(
      screen.getByRole("textbox", { name: /^password/i }),
      "pass123"
    );

    userEvent.type(
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
      userEvent.click(screen.getByRole("button", { name: /submit/i }));
      expect(registerSubmit).toHaveBeenCalledWith(expected);
      // mock response, expect setClientSecret to have been called
    });
  });

  it("shows error message if form fields are rejected", () => {
    // errors
  });

  it("shows error message when server returns error", () => {
    // errors
  });

  it("disables `Next` button if disabled prop is passed", () => {
    renderComponent({ disableNextButton: true });
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });

  it("enables `Next` button if `insertedId` is present", () => {
    renderComponent();
    expect(screen.getByRole("button", { name: /next/i })).toBeEnabled();
  });

  it("calls next handler if form is valid and secret returned", async () => {
    const { onNextClick } = renderComponent();

    userEvent.click(screen.getByRole("button", { name: /next/i }));

    await waitFor(() => {
      expect(onNextClick).toHaveBeenCalled();
    });
  });
});
