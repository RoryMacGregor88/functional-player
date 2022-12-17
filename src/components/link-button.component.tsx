import { FC, ReactNode, ReactElement } from 'react';

import { ButtonBase } from '@mui/material';

interface Props {
  children: ReactNode;
}

const LinkButton: FC<Props> = ({ children }): ReactElement => (
  <ButtonBase
    style={{
      cursor: 'pointer',
      borderBottom: '2px solid orange',
      width: 'fit-content',
      marginLeft: '0.5rem',
      fontSize: '1rem',
    }}
  >
    {children}
  </ButtonBase>
);

export default LinkButton;
