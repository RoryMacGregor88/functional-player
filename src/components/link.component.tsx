import { FC, ReactElement, ReactNode } from 'react';

import NextLink from 'next/link';

import { styled } from '@mui/material';

const StyledLink = styled(NextLink)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  color: theme.palette.text.primary,
  '&:hover': {
    opacity: '0.75',
  },
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
