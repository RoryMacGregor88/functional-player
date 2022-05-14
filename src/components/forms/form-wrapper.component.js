import { Grid } from "@mui/material";

/**
 * @param {
 *  onSubmit: function
 *  children: React.ReactNode
 * } props
 */
const FormWrapper = ({ onSubmit, children }) => (
  <Grid
    container
    component="form"
    direction="column"
    gap="1rem"
    onSubmit={onSubmit}
  >
    {children}
  </Grid>
);

export default FormWrapper;
