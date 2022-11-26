import NextLink from 'next/link';

import {styled} from '@mui/material'

const StyledLink = styled(NextLink)(({theme}) => ({
    textDecoration: 'none',
    color: theme.palette.text.primary
}))

const Link = (props: any) => <StyledLink {...props} />;

export default Link;
