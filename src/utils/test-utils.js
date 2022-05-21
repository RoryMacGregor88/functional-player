import { render as rtlRender } from "@testing-library/react";

const render = (ui, { ...options } = {}) => {
  const utils = rtlRender(ui, { ...options });
  return { ...utils };
};

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

export { render };
