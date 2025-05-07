import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";

interface ConfirmationDialogProps {
  response: () => void;
  title: string;
  description: string;
  children: (showDialog: () => void) => React.ReactNode;
  confirmButtonProps?: ButtonProps;
  cancelButtonProps?: ButtonProps;
}

export default function ConfirmationDialog({
  response,
  title,
  description,
  children,
  confirmButtonProps = {},
  cancelButtonProps = {},
}: ConfirmationDialogProps) {
  //local states
  const [open, setOpen] = useState(false);

  const showDialog = () => {
    setOpen(true);
  };

  const hideDialog = () => {
    setOpen(false);
  };

  const confirmRequest = () => {
    response();
    hideDialog();
  };

  return (
    <>
      {children(showDialog)}
      {open && (
        <Dialog
          open={open}
          onClose={hideDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {description}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={confirmRequest}
              color="secondary"
              variant="outlined"
              {...confirmButtonProps}
            >
              Yes
            </Button>
            <Button
              onClick={hideDialog}
              color="secondary"
              variant="outlined"
              {...cancelButtonProps}
            >
              No
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
