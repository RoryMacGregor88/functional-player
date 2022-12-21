import { FC, ReactElement } from 'react';

import NextLink from 'next/link';

import { styled } from '@mui/material';

const StyledLink = styled(NextLink)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
}));

const Link: FC = (props: any): ReactElement => <StyledLink {...props} />;

export default Link;
