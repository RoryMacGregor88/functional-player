import fetch from "jest-fetch-mock";

import { render, screen, userEvent, waitFor } from "@/src/utils/test-utils";

import { SubscribeForm } from "@/src/components";

fetch.enableMocks();

describe("Subscribe Form", () => {
  it("renders", () => {
    render(<SubscribeForm />);
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("fetches stripe client secret upon load", () => {});

  it("shows error well if error returned from initial fetch", () => {});

  it("shows error well if error returned from stripe", () => {});

  it("redirects to success page if success returned from stripe", () => {
    // pass history to util render
  });
});
