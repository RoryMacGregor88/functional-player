import { ReactElement } from 'react';

import { NextRouter } from 'next/router';

import { render as rtlRender } from '@testing-library/react';

import { RouterContext } from 'next/dist/shared/lib/router-context';

import { Context } from '@/src/utils';

import { Ctx } from '@/src/utils/interfaces';

interface Options {
  ctx?: Partial<Ctx>;
  updateCtx?: (newData: Partial<Ctx>) => void;
  push?: (href: string) => void;
  options?: any;
}

const render = (
  ui: ReactElement,
  { ctx = {}, updateCtx = () => {}, push = () => {}, ...options }: Options = {}
) => {
  const router: NextRouter = {
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

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { render };
