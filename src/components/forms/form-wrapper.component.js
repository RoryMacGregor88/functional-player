import { Grid, Box } from "@mui/material";

/**
 * @param {
 *  onSubmit: function
 *  children: React.ReactNode
 * } props
 */
const FormWrapper = ({ onSubmit, children }) => (
  <Box sx={{ minWidth: "50%" }} justifyContent="center" alignItems="center">
    <Grid
      container
      component="form"
      direction="column"
      gap="1rem"
      onSubmit={onSubmit}
    >
      {children}
    </Grid>
  </Box>
);

export default FormWrapper;
