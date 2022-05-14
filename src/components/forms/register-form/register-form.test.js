import { render, screen } from "src/utils/test-utils";

import RegisterForm from "./register-form.component";

describe("RegisterForm", () => {
  it("renders", () => {
    render(<RegisterForm />);

    expect(screen.getByPlaceholderText("username")).toBeInTheDocumnent();
  });
});
