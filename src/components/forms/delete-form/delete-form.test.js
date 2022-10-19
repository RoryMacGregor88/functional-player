import { render, screen, userEvent, waitFor } from "@/src/utils";
import DeleteForm from "./delete-form.component";

describe("Delete Form", () => {
  it("renders", () => {
    render(<DeleteForm />);

    expect(
      screen.getByText("Click below to delete your account")
    ).toBeInTheDocument();
  });

  it("Shows delete verification button", async () => {
    render(<DeleteForm />);

    userEvent.click(screen.getByRole("button", { name: /proceed/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /permanently delete my account/i })
      ).toBeInTheDocument();
    });
  });

  it("calls delete handler", async () => {
    const handleDelete = jest.fn();
    render(<DeleteForm handleDelete={handleDelete} />);

    userEvent.click(screen.getByRole("button", { name: /proceed/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /permanently delete my account/i })
      ).toBeInTheDocument();
    });

    userEvent.click(
      screen.getByRole("button", { name: /permanently delete my account/i })
    );

    await waitFor(() => {
      expect(handleDelete).toHaveBeenCalled();
    });
  });
});
