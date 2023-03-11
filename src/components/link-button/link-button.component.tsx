import { FC, ReactNode, ReactElement } from 'react';

import { ButtonBase } from '@mui/material';

interface Props {
  noLeftMargin?: boolean;
  onClick?: () => void;
  children: ReactNode;
}

const LinkButton: FC<Props> = ({
  noLeftMargin = false,
  onClick,
  children,
}): ReactElement => (
  <ButtonBase
    onClick={onClick ?? null}
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
