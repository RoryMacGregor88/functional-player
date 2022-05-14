import { Grid, Typography } from "@mui/material";

const Footer = () => (
  <Grid
    container
    component="footer"
    justifyContent="center"
    alignItems="center"
    sx={{
      minHeight: "20rem",
      backgroundColor: "palette.background.default",
      borderTopColor: "palette.primary.main",
      borderTopStyle: "solid",
      borderTopWidth: "1px",
    }}
  >
    <Grid item component={Typography} variant="h2">
      Footer
    </Grid>
  </Grid>
);

export default Footer;
