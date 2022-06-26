import { Typography } from "@mui/material";

import {
  IconButton,
  BookmarkAddIcon,
  BookmarkAddedIcon,
} from "@/src/components";

/**
 * @param {{
 *  isBookmarked: boolean,
 *  handleBookmarkClick: function
 *  sx: object
 * }} props
 */
const BookmarkIconButton = ({ isBookmarked, handleBookmarkClick, sx = {} }) => {
  const text = isBookmarked ? "In your list" : "Add to list";
  const color = isBookmarked ? "green" : "red";

  const iconSx = {
    height: "2rem",
    width: "2rem",
    marginLeft: "0.5rem",
    color,
  };

  // TODO: should this be an icon or a button? This currently has no hover

  return (
    <IconButton
      onClick={handleBookmarkClick}
      sx={{
        padding: "0 0.5rem",
        border: `2px solid ${color}`,
        borderRadius: "5px",
        ...sx,
      }}
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
