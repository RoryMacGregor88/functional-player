import { forwardRef } from 'react';
import NextLink from 'next/link';

const Link = (props, ref) => <NextLink {...props} ref={ref} />;

export default forwardRef(Link);
