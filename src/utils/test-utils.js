import { render as rtlRender } from "@testing-library/react";
import { Context } from "@/src/utils";
import { RouterContext } from "next/dist/shared/lib/router-context";
import fetchMock, { enableFetchMocks } from "jest-fetch-mock";

const mockRouterConfig = {
  push: jest.fn(),
  prefetch: () => ({ catch: () => {} }),
};

const render = (ui, { ctx = {}, ...options } = {}) => {
  const updateCtx = jest.fn(),
    router = mockRouterConfig;
  const Wrapper = ({ children }) => (
    <Context.Provider value={{ ctx, updateCtx }}>
      <RouterContext.Provider value={router}>{children}</RouterContext.Provider>
    </Context.Provider>
  );
  const utils = rtlRender(ui, { wrapper: Wrapper, ...options });
  return { ...utils, ctx, updateCtx, router };
};

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
export { fetchMock, enableFetchMocks };
export { render };
