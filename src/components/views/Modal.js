import React from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Dialog,
  Typography,
  IconButton,
  Button,
  DialogContent,
  AppBar,
  Toolbar,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";
import isMobile from "../../redundant_functions/isMobile";
import { Close } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
const styles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: "#263040",
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
}));
export default function Modal(props) {
  const classes = styles();
  return (
    <Dialog
      open={true}
      fullWidth={true}
      onClose={props.onClose ? props.onClose : null}
      aria-labelledby="form-dialog-title"
      fullScreen={isMobile()}
    >
      {isMobile() ? (
        <AppBar className={classes.appbar} id="form-dialog-title">
          <Toolbar>
            {props.closeButton && (
              <IconButton
                edge="start"
                color="inherit"
                onClick={props.onClose ? props.onClose : null}
              >
                <Close />
              </IconButton>
            )}
            <Typography className={classes.title} variant="h6">
              {props.title ? props.title : "Modal title"}
            </Typography>
            {props.submitButton && (
              <Button
                color="inherit"
                onClick={props.onSubmit ? props.onSubmit : null}
                disabled={props.loading || props.isDisabled}
              >
                {props.loading ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : props.submitValue ? (
                  props.submitValue
                ) : (
                  "Clicka här"
                )}
              </Button>
            )}
          </Toolbar>
        </AppBar>
      ) : (
        <DialogTitle>{props.title ? props.title : "Modal title"}</DialogTitle>
      )}
      <DialogContent>{props.children}</DialogContent>
      {!isMobile() && (
        <DialogActions>
          {props.closeButton && !props.onlyMobileClose ? (
            <Button
              color="inherit"
              onClick={props.onClose ? props.onClose : null}
            >
              {props.loading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : props.closeValue ? (
                props.closeValue
              ) : (
                "Stäng"
              )}
            </Button>
          ) : (
            ""
          )}
          {props.submitButton && (
            <Button color="inherit" onClick={props.onSubmit}>
              {props.loading ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : props.submitValue ? (
                props.submitValue
              ) : (
                "Clicka här"
              )}
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
}
