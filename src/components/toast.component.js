import { Snackbar, Fade, Alert, useMediaQuery } from "@mui/material";

import { IconButton, CloseIcon } from "@/src/components";

/** @param {{ onClick: function }} props */
const Action = ({ onClick }) => {
  return (
    <IconButton onClick={onClick}>
      <CloseIcon sx={{ height: "1rem", width: "1rem" }} />
    </IconButton>
  );
};

const Toast = ({ open, message, onClose, severity = "success" }) => {
  const isMedium = useMediaQuery("(max-width:1000px)");

  // TODO: Fade not working
  // TODO: Action not working

  const anchorOrigin = {
    vertical: isMedium ? "bottom" : "top",
    horizontal: isMedium ? "center" : "right",
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      TransitionComponent={Fade}
      action={<Action onClick={onClose} />}
    >
      <Alert severity={severity}>{message}</Alert>
    </Snackbar>
  );
};

export default Toast;
