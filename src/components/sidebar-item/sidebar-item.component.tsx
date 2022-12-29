import { ReactElement, FC } from 'react';

import { SvgIconTypeMap } from '@mui/material';

import { OverridableComponent } from '@mui/material/OverridableComponent';

import { IconButton, Link } from '@/src/components';

// TODO: check this works with Link, no ref errors in console
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
  <Link href={href}>
    <IconButton
      onClick={onClick}
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        color: isSelected ? 'primary.main' : 'common.white',
        fontSize: '1.25rem',
        opacity: '1',
        '&:hover': {
          opacity: '0.75',
        },
      }}
    >
      <Icon
        data-testid={`${label}-icon`}
        sx={{
          height: '1.25rem',
          width: '1.25rem',
          marginRight: '1rem',
        }}
      />
      <span>{label}</span>
    </IconButton>
  </Link>
);

export default SidebarItem;
