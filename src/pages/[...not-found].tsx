import { ReactElement, useEffect } from 'react';

import { useRouter } from 'next/router';

import { LoadMask } from '@/src/components';

import { UpdateCtx } from '@/src/utils/interfaces';

import { PAGE_DOES_NOT_EXIST_MESSAGE } from '@/src/utils/constants';

interface Props {
  updateCtx: UpdateCtx;
}

export default function NotFound({ updateCtx }: Props): ReactElement {
  const { push } = useRouter();

  useEffect(() => {
    push('/dashboard');
    updateCtx({
      toastData: {
        severity: 'error',
        message: PAGE_DOES_NOT_EXIST_MESSAGE,
      },
    });
  }, [push, updateCtx]);

  return <LoadMask />;
}
