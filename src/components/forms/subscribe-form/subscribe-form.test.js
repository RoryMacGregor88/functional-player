import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

import { render, screen, userEvent, waitFor } from "@/src/utils/test-utils";

import { SubscribeForm } from "@/src/components";

import { DEFAULT_ERROR_MESSAGE } from "@/src/utils";

enableFetchMocks();

describe("Subscribe Form", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it("renders", () => {
    render(<SubscribeForm />);
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("shows error well if error returned from stripe", () => {
    fetchMock.mockResponse(
      JSON.stringify(new Error("replace with real stripe error"))
    );

    const setWellData = jest.fn();
    render(<SubscribeForm setWellData={setWellData} />);

    // type into PaymentElement

    expect(setWellData).toHaveBeenCalledWith({});
    expect(DEFAULT_ERROR_MESSAGE).toBeInTheDocument();
  });

  it("redirects to success page if success returned from stripe", () => {
    // TODO: not sure how to test this
  });
});
