import { Grid, Typography } from "@mui/material";

/** @param {{ children: React.ReactChildren }} props */
const SpacedTitle = ({ children }) => (
  <Grid
    item
    component={Typography}
    variant="h2"
    sx={{ width: "100%", margin: "2rem 0", textAlign: "center" }}
  >
    {children}
  </Grid>
);

export default SpacedTitle;
