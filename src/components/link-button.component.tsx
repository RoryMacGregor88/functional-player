import { FC, ReactNode, ReactElement } from 'react';

import { ButtonBase } from '@mui/material';

interface Props {
  noLeftMargin?: boolean;
  children: ReactNode;
}

const LinkButton: FC<Props> = ({
  noLeftMargin = false,
  children,
}): ReactElement => (
  <ButtonBase
    style={{
      cursor: 'pointer',
      borderBottom: '2px solid orange',
      width: 'fit-content',
      marginLeft: noLeftMargin ? '0' : '0.5rem',
      fontSize: '1rem',
    }}
  >
    {children}
  </ButtonBase>
);

export default LinkButton;
