import { render as rtlRender } from "@testing-library/react";
import { Context } from "@/src/utils";
import { RouterContext } from "next/dist/shared/lib/router-context";

const render = (
  ui,
  { ctx = {}, updateCtx = () => {}, push = () => {}, ...options } = {}
) => {
  const router = {
    push,
    prefetch: () => ({ catch: () => {} }),
  };
  const Wrapper = ({ children }) => (
    <RouterContext.Provider value={router}>
      <Context.Provider value={{ ctx, updateCtx }}>{children}</Context.Provider>
    </RouterContext.Provider>
  );
  const utils = rtlRender(ui, { wrapper: Wrapper, ...options });
  return { ...utils, ctx, updateCtx, router };
};

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
export { render };
