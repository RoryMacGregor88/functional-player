import NotFound from "@/src/pages/[...not-found]";
import { render } from "@/src/utils";

describe("notFound", () => {
  it("redirects to home if no user found", () => {
    const { router } = render(<NotFound user={null} />, { push: jest.fn() });
    expect(router.push).toHaveBeenCalledWith("/");
  });

  it("redirects to dashboard if user found", () => {
    const { router } = render(<NotFound user={{ username: "John Smith" }} />, {
      push: jest.fn(),
    });
    expect(router.push).toHaveBeenCalledWith("/dashboard");
  });
});