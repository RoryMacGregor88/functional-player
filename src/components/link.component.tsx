import { FC, ReactElement, ReactNode } from 'react';

import NextLink from 'next/link';

import { styled } from '@mui/material';

const StyledLink = styled(NextLink)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
}));

interface Props {
  href: string;
  onClick?: () => void;
  children: ReactNode;
}

const Link: FC<Props> = ({ href, onClick, children }): ReactElement => (
  <StyledLink href={href} onClick={onClick} passHref>
    {children}
  </StyledLink>
);

export default Link;
