import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { Button, CloseIcon } from "@/src/components";

/**
 * @param {{
 *  open: boolean,
 *  onClose: function,
 *  title: string,
 *  message?: string,
 *  actions?: React.ReactNode[],
 * }} props
 */
const Dialog = ({ open = false, onClose, title, message, actions }) => {
  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      aria-labelledby={title}
      aria-describedby={title}
      sx={{
        zIndex: 4000,
        ".MuiDialog-paper": {
          justifyContent: "space-evenly",
          alignItems: "center",
        },
      }}
    >
      <CloseIcon
        onClick={onClose}
        sx={{ margin: "0.5rem 0.5rem 0 auto", cursor: "pointer" }}
      />
      {!!title ? (
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      ) : null}
      <DialogContent>{message}</DialogContent>
      {!!actions ? (
        <DialogActions
          disableSpacing
          sx={{
            width: "100%",
            padding: "0.5rem 1rem",
            gap: "1rem",
          }}
        >
          {actions.map(({ label, onClick, closeOnClick }) => (
            <Button
              key={label}
              onClick={() => {
                onClick();
                if (closeOnClick) onClose();
              }}
            >
              {label}
            </Button>
          ))}
        </DialogActions>
      ) : null}
    </MuiDialog>
  );
};

export default Dialog;
