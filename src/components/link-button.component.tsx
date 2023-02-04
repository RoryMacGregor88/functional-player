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
    sx={{
      cursor: 'pointer',
      borderBottomWidth: '2px',
      borderBottomStyle: 'solid',
      borderBottomColor: 'primary.main',
      width: 'fit-content',
      marginLeft: noLeftMargin ? '0' : '0.5rem',
      fontSize: '1rem',
    }}
  >
    {children}
  </ButtonBase>
);

export default LinkButton;
