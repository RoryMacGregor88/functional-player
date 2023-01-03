import { useContext, createContext } from 'react';

import { ContextProps } from '@/src/utils/interfaces';

export const Context = createContext(null);
const useCtx = () => useContext<ContextProps>(Context);

export default useCtx;
