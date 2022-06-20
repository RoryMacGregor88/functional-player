import { Typography, Grid, Button } from "@mui/material";
import { VideoPlayer } from "@/src/components";

const VideoDisplay = ({ title, description, videoUrl }) => (
  <>
    <Typography variant="h3">{title}</Typography>
    <Typography variant="body1">{description}</Typography>
    <VideoPlayer videoUrl={videoUrl} alt={description} />
    <Grid container alignItems="center" justifyContent="flex-start">
      <Grid item component={Button}>
        More of this style
      </Grid>
      <Grid item component={Button}>
        More from this artist
      </Grid>
      {/* social media share icons */}
    </Grid>
  </>
);

export default VideoDisplay;
