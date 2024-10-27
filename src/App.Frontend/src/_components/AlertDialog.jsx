import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { CircularProgress } from "@mui/material";

export default function AlertDialog({
  alertText,
  confirmText,
  cancelText,
  confirmCallback,
  cancelCallback,
}) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  async function handleClose(confirm) {
    if (confirm === true && typeof confirmCallback === "function") {
      console.log("AlertDialog");
      setLoading(true);
      await confirmCallback();
      setLoading(false);
    } else if (confirm === false && typeof cancelCallback === "function") {
      console.log("c");
      setLoading(true);
      await cancelCallback();
      setLoading(false);
    }

    setOpen(false);
  }

  return {
    dialog: (
      <React.Fragment>
        <Dialog
          open={open}
          onClose={async () => await handleClose(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {alertText}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              disabled={loading === true}
              onClick={async () => await handleClose(false)}
            >
              {cancelText ? cancelText : "cancel"}
            </Button>
            <Button
              disabled={loading === true}
              onClick={async () => await handleClose(true)}
              autoFocus
            >
              {confirmText ? confirmText : "confirm"}
            </Button>
            {loading === true && <CircularProgress size={24} />}
          </DialogActions>
        </Dialog>
      </React.Fragment>
    ),
    handleClickOpen,
  };
}
