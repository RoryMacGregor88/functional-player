import { FC, ReactElement, ReactNode } from 'react';

import NextLink from 'next/link';

import { styled, Theme } from '@mui/material';

interface StyledProps {
  theme?: Theme;
  disableHover: boolean;
}

const StyledLink = styled(NextLink)(({ theme, disableHover }: StyledProps) => {
  const hoverStyles = disableHover ? {} : { '&:hover': { opacity: '0.75' } };
  return {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: theme.palette.text.primary,
    ...hoverStyles,
  };
});

interface Props {
  href: string;
  onClick?: () => void;
  disableHover?: boolean;
  children: ReactNode;
}

const Link: FC<Props> = ({
  href,
  onClick,
  disableHover = false,
  children,
}): ReactElement => (
  <StyledLink
    href={href}
    onClick={onClick}
    disableHover={disableHover}
    passHref
  >
    {children}
  </StyledLink>
);

export default Link;
