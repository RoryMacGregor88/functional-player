import { ReactElement } from 'react';

import { render as rtlRender } from '@testing-library/react';

import { RouterContext } from 'next/dist/shared/lib/router-context';

import { Context } from '@/src/utils';

import { Ctx } from '@/src/utils/interfaces';

interface Options {
  ctx?: Partial<Ctx>;
  updateCtx?: () => void;
  push?: (href: string) => void;
  query?: Record<string, any>;
}

const render = (
  ui: ReactElement,
  { ctx = {}, updateCtx = () => {}, push = () => {}, query = {} }: Options = {}
) => {
  // for testing only, don't care about type enforcement
  const router: any = {
    push,
    prefetch: () => ({ catch: () => {} }),
    query,
  };
  const Wrapper = ({ children }) => (
    <RouterContext.Provider value={router}>
      <Context.Provider value={{ ctx, updateCtx }}>{children}</Context.Provider>
    </RouterContext.Provider>
  );
  const utils = rtlRender(ui, { wrapper: Wrapper });
  return { ...utils, ctx, updateCtx, router };
};

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { render };
