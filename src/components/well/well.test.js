import { screen, render } from "@/src/utils";

import Well from "./well.component";

describe("Well", () => {
  it("renders with title and message", () => {
    const title = "test-title";
    const message = "test-message";

    render(<Well title={title} message={message} />);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
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
