import { Typography, Grid, Button } from "@mui/material";
import { VideoPlayer } from "@/src/components";

const Overlay = ({ title, description }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        color: "#000",
        opacity: "0.5",
        height: "100%",
        width: "100%",
      }}
    >
      <Typography variant="h3">{title}</Typography>
      <Typography variant="body1">{description}</Typography>
      <Grid container alignItems="center" justifyContent="flex-start">
        <Button>More of this style</Button>
        <Button>More from this artist</Button>
        {/* social media share icons */}
      </Grid>
    </div>
  );
};

const VideoDisplay = ({ title, description, videoId }) => (
  <>
    <Overlay title={title} description={description} />
    {/* <VideoPlayer videoId={videoId} alt={description} /> */}
  </>
);

export default VideoDisplay;
