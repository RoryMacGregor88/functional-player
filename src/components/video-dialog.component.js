import { useEffect } from "react";
import { useRouter } from "next/router";
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

import { updateBookmarks, http } from "@/src/utils";

/**
 * @param {
 *  selectedVideo: object,
 *  isBookmarked: boolean,
 *  onBookmarkClick: function,
 *  onClose: function,
 *  deviceSize: string
 * } params
 */
const Overlay = ({
  videoId,
  selectedVideo,
  isBookmarked,
  onBookmarkClick,
  onClose,
}) => {
  const { title, description } = selectedVideo;
  return (
    <Grid
      item
      container
      wrap="nowrap"
      gap={4}
      direction="column"
      justifyContent="center"
      alignItems="flex-start"
      sx={{
        position: "relative",
        width: "50%",
        height: "100%",
      }}
    >
      <Grid
        item
        container
        direction="column"
        justifyContent="space-between"
        alignItems="flex-start"
        sx={{ width: "100%" }}
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
      </Grid>
      <Grid
        item
        container
        direction="column"
        alignItems="center"
        sx={{ width: "100%", height: "50%", position: "relative" }}
      >
        <VideoPlayer videoId={videoId} />
      </Grid>
      <Grid item container alignItems="center" gap="1rem" wrap="nowrap">
        <Button>More</Button>
        <Button>Feedback</Button>
      </Grid>
    </Grid>
  );
};

/**
 * @param {
 *  open: boolean,
 *  user: object|null,
 *  selectedVideo: object,
 *  onClose: function
 * } params
 */
const VideoDialog = ({ open, user, updateCtx, selectedVideo, onClose }) => {
  const router = useRouter();

  // TODO: useEffect not running
  // TODO: make this another util, test
  useEffect(() => {
    if (!!user) {
      (async () => {
        // TODO: try/catch here for client error
        const { error, resUser } = await http("/last-watched", {
          email: user.email,
          _id: selectedVideo?._id,
        });

        if (!!user) {
          updateCtx({ user: resUser });
        } else if (!!error) {
          updateCtx({
            toastData: {
              message: error.message,
              severity: "error",
            },
          });
        }
      })();
    }
  }, []);

  const isMedium = useMediaQuery("(max-width:1200px)");
  const isSmall = useMediaQuery("(max-width:600px)");

  if (!selectedVideo) {
    return null;
  }

  const { _id, videoId } = selectedVideo;

  // TODO: add trailerId to all videos in db
  const trailerId = videoId;

  const deviceSize = isSmall ? "small" : isMedium ? "medium" : "large";
  const isBookmarked = !!user?.bookmarks.includes(_id);

  const onActionClick = (path) => {
    router.push(path);
    onClose();
  };

  const onBookmarkClick = () =>
    !!user
      ? updateBookmarks(_id, user, updateCtx)
      : updateCtx({
          dialogData: {
            title: "Welcome to Functional Player",
            message:
              "You must have a user account to save courses to your list. Please either login or register with us using the buttons below.",
            actions: [
              {
                label: "Login",
                onClick: () => onActionClick("/login"),
                closeOnClick: true,
              },
              {
                label: "Register",
                onClick: () => onActionClick("/register"),
                closeOnClick: true,
              },
            ],
          },
        });

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
            videoId={
              user?.subscriptionStatus === "active" ? videoId : trailerId
            }
            selectedVideo={selectedVideo}
            isBookmarked={isBookmarked}
            onBookmarkClick={onBookmarkClick}
            onClose={onClose}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default VideoDialog;
