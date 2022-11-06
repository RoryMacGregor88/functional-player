import { ReactElement, FC } from 'react';

import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

import { IconButton, Link } from '@/src/components';

interface Props {
  href?: string;
  label: string;
  Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
  onClick: Function;
  isSelected?: boolean;
}

const SidebarItem: FC<Props> = ({
  href = '',
  label,
  Icon,
  onClick,
  isSelected = false,
}): ReactElement => (
  <Link href={href} passHref>
    <IconButton
      onClick={onClick}
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        color: isSelected ? 'primary.main' : 'common.white',
        fontSize: '1.25rem',
      }}
    >
      <Icon sx={{ height: '1.5rem', width: '1.5rem', marginRight: '1rem' }} />

    </IconButton>
  </Link>
);

export default SidebarItem;
