import { FC, ReactElement } from 'react';

import { Typography, SxProps, Theme } from '@mui/material';

import {
  IconButton,
  BookmarkAddIcon,
  BookmarkAddedIcon,
} from '@/src/components';

interface Props {
  isBookmarked: boolean;
  onBookmarkClick: () => void;
  sx?: SxProps<Theme>;
}

const BookmarkIconButton: FC<Props> = ({
  isBookmarked,
  onBookmarkClick,
  sx = {},
}): ReactElement => {
  const text: string = isBookmarked ? 'In your list' : 'Add to list';
  const color: string = isBookmarked ? 'green' : 'white';

  const iconSx: object = {
    height: '2rem',
    width: '2rem',
    marginLeft: '0.5rem',
    color,
  };
  // TODO: should this be an icon or a button? This currently has no hover
  return (
    <IconButton
      onClick={onBookmarkClick}
      sx={{
        padding: '0 0.5rem',
        border: `2px solid ${color}`,
        borderRadius: '5px',
        ...sx,
      }}
      data-testid='bookmark-icon'
    >
      <Typography sx={{ color }}>{text}</Typography>
      {isBookmarked ? (
        <BookmarkAddedIcon sx={iconSx} />
      ) : (
        <BookmarkAddIcon sx={iconSx} />
      )}
    </IconButton>
  );
};

export default BookmarkIconButton;
