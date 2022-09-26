import NextImage from "next/image";
import {
  Dialog,
  IconButton,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";

import { ArrowBackIcon, VideoPlayer, Button } from "@/src/components";

const Overlay = ({ selectedVideo, onClose, deviceSize }) => {
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
        <IconButton
          onClick={onClose}
          sx={{ width: "fit-content", padding: "0" }}
        >
          <ArrowBackIcon sx={{ height: "2.5rem", width: "2.5rem" }} />
        </IconButton>
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

const VideoDialog = ({ open, selectedVideo, onClose }) => {
  const isMedium = useMediaQuery("(max-width:1200px)");
  const isSmall = useMediaQuery("(max-width:600px)");

  const deviceSize = isSmall ? "small" : isMedium ? "medium" : "large";

  if (!selectedVideo) {
    return null;
  }

  return (
    <Dialog open={open} fullScreen transitionDuration={500}>
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
            selectedVideo={selectedVideo}
            onClose={onClose}
            deviceSize={deviceSize}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default VideoDialog;
