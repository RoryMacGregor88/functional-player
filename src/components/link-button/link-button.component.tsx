import { FC, ReactNode, ReactElement } from 'react';

import { ButtonBase, SxProps, Theme } from '@mui/material';

interface Props {
  noLeftMargin?: boolean;
  onClick?: () => void;
  sx?: SxProps<Theme>;
  children: ReactNode;
}

const LinkButton: FC<Props> = ({
  noLeftMargin = false,
  onClick,
  sx,
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
      ...sx,
    }}
  >
    {children}
  </ButtonBase>
);

export default LinkButton;
