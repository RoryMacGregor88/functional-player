import { useContext, createContext } from 'react';

import { ContextProps } from '@/src/utils/interfaces';

const Context = createContext(null);
const useCtx = () => useContext<ContextProps>(Context);

export default useCtx;
