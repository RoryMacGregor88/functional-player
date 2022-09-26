import NextImage from "next/image";
import {
  Dialog,
  IconButton,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";

import {
  ArrowBackIcon,
  VideoPlayer,
  Button,
  BookmarkIconButton,
} from "@/src/components";

import { updateBookmarks } from "@/src/utils";

/**
 * @param {
 *  user: object,
 *  selectedVideo: object,
 *  isBookmarked: boolean,
 *  onBookmarkClick: function,
 *  onClose: function,
 *  deviceSize: string
 * } params
 */
const Overlay = ({
  user,
  selectedVideo,
  isBookmarked,
  onBookmarkClick,
  onClose,
  deviceSize,
}) => {
  const { videoId, title, description } = selectedVideo;
  const isLarge = deviceSize === "large";
  return (
    <Grid
      item
      container
      gap={4}
      direction={isLarge ? "row" : "column"}
      alignItems={"stretch"}
      wrap="nowrap"
      sx={{
        maxWidth: isLarge ? "80rem" : "100%",
      }}
    >
      <Grid
        item
        container
        direction="column"
        justifyContent="space-between"
        alignItems={isLarge ? "flex-start" : "center"}
        sx={{ width: isLarge ? "50%" : "100%" }}
      >
        <Grid item container justifyContent="space-between" alignItems="center">
          <IconButton
            onClick={onClose}
            sx={{ width: "fit-content", padding: "0" }}
          >
            <ArrowBackIcon sx={{ height: "2.5rem", width: "2.5rem" }} />
          </IconButton>
          <BookmarkIconButton
            isBookmarked={isBookmarked}
            onBookmarkClick={onBookmarkClick}
          />
        </Grid>

        <>
          <Typography variant="h2">{title}</Typography>
          <Typography variant="body1">{description}</Typography>
        </>

        <Grid item container alignItems="center" gap="1rem" wrap="nowrap">
          <Button>More</Button>
          <Button>Feedback</Button>
        </Grid>
      </Grid>
      <Grid
        item
        container
        direction="column"
        alignItems="center"
        sx={{ width: isLarge ? "50%" : "100%" }}
      >
        <VideoPlayer videoId={videoId} />
      </Grid>
    </Grid>
  );
};

/**
 * @param {
 *  open: boolean,
 *  user: object,
 *  selectedVideo: object,
 *  onClose: function
 * } params
 */
const VideoDialog = ({ open, user, updateCtx, selectedVideo, onClose }) => {
  const isMedium = useMediaQuery("(max-width:1200px)");
  const isSmall = useMediaQuery("(max-width:600px)");

  if (!selectedVideo) {
    return null;
  }

  const deviceSize = isSmall ? "small" : isMedium ? "medium" : "large";

  const isBookmarked = user?.bookmarks.includes(selectedVideo._id) ?? false;

  const onBookmarkClick = () => {
    if (!user) {
      //show dialog with prompt to sign up
    }
    updateBookmarks(_id, user, updateCtx);
  };

  return (
    <Dialog
      open={open}
      fullScreen
      transitionDuration={500}
      sx={{ zIndex: 2000 }}
    >
      <Grid
        container
        sx={{
          height: "100%",
          width: "100%",
          position: "relative",
        }}
      >
        <NextImage
          src={`/telecaster-${deviceSize}.jpg`}
          objectFit="cover"
          layout="fill"
          quality={100}
        />
        <Grid
          item
          container
          justifyContent="center"
          alignItems="center"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            padding: "0 2rem",
          }}
        >
          <Overlay
            user={user}
            selectedVideo={selectedVideo}
            isBookmarked={isBookmarked}
            onBookmarkClick={onBookmarkClick}
            onClose={onClose}
            deviceSize={deviceSize}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default VideoDialog;
