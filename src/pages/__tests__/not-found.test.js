import NotFound from "@/src/pages/[...not-found]";
import { render } from "@/src/utils";

describe("notFound", () => {
  it("redirects to home if no user found", () => {
    const { router } = render(<NotFound user={null} />);
    expect(router.push).toHaveBeenCalledWith("/");
  });

  it("redirects to dashboard if user found", () => {
    const { router } = render(<NotFound user={{ username: "John Smith" }} />);
    expect(router.push).toHaveBeenCalledWith("/dashboard");
  });
});
