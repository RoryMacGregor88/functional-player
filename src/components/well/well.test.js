import { screen, render } from "@/src/utils/test-utils";

import Well from "./well.component";

describe("Well", () => {
  it("renders", () => {
    render(<Well title="test-title" message="test-message" />);

    expect(
      screen.getByRole("heading", { name: "test-title" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { title: "test-heading" })
    ).toBeInTheDocument();
  });

  it("defaults to Error title if ", () => {
    render(<Well />);

    expect(
      screen.getByRole("heading", { name: "Success!" })
    ).toBeInTheDocument();
  });

  it("defaults to Success title if no title given", () => {
    render(<Well severity="success" />);

    expect(
      screen.getByRole("heading", { name: "Success!" })
    ).toBeInTheDocument();
  });
});
