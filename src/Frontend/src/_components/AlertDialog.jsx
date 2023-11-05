import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";

export default function AlertDialog({
  alertText,
  confirmText,
  cancelText,
  confirmCallback,
  cancelCallback,
}) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  async function handleClose(confirm) {
    if (confirm === true && typeof confirmCallback === "function") {
      await confirmCallback();
    } else if (confirm === false && typeof cancelCallback === "function") {
      await cancelCallback();
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
          {/* <DialogTitle id="alert-dialog-title">
              {"Use Google's location service?"}
            </DialogTitle> */}
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {alertText}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={async () => await handleClose(false)}>
              {cancelText ? cancelText : "cancel"}
            </Button>
            <Button onClick={async () => await handleClose(true)} autoFocus>
              {confirmText ? confirmText : "confirm"}
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    ),
    handleClickOpen,
  };
}
