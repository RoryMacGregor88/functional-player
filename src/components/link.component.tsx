import { FC, ReactElement, ReactNode } from 'react';

import NextLink from 'next/link';

import { styled } from '@mui/material';

const StyledLink = styled(NextLink)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
}));

interface Props {
  href: string;
  children: ReactNode;
}

const Link: FC<Props> = ({ href, children }): ReactElement => (
  <StyledLink href={href}>{children}</StyledLink>
);

export default Link;
