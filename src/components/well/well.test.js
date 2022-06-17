import { screen, render } from "@/src/utils/test-utils";

import Well from "./well.component";

describe("Well", () => {
  it("renders with title and message", () => {
    render(<Well title="test-title" message="test-message" />);

    expect(screen.getByText("test-title")).toBeInTheDocument();

    expect(screen.getByText("test-message")).toBeInTheDocument();
  });

  it("defaults to Error title if no title given", () => {
    render(<Well />);

    expect(screen.getByText("Error!")).toBeInTheDocument();
  });

  it("shows Success title if success severity passed", () => {
    render(<Well severity="success" />);

    expect(screen.getByText("Success!")).toBeInTheDocument();
  });
});
