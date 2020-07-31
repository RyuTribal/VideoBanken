import React, { Component } from "react";
import { StyleSheet, css } from "aphrodite";
import Avatar from "react-avatar-edit";
import {
  Slider,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Toolbar,
  AppBar,
  Typography,
} from "@material-ui/core";
import {
  withStyles,
  createMuiTheme,
  ThemeProvider,
} from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";
import theme from "../../../theme";
const styles = StyleSheet.create({
  modal: {
    height: "100%",
    position: "relative",
    margin: "0 auto",
    padding: "1.5em",
    "-webkit-overflow-scrolling": "touch",
    "@media (min-width: 60em)": {
      height: "75%",
      margin: "5% auto",
      maxHeight: "57em",
      maxWidth: "66em",
      width: "85%",
    },
    backgroundColor: "#F7F8FC",
    "z-index": "90001",
  },
  modalHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    "@media (max-width: 601px)": {
      fontSize: 13,
    },
    "@media (max-width: 376px)": {
      fontSize: 11,
    },
    paddingBottom: 20,
  },
  header: {
    flex: 4,
    textAlign: "center",
  },
  buttonContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  right: {
    justifyContent: "flex-start",
  },
  submitButton: {
    background: "#ea3a3a",
    padding: "10px 20px",
    fontSize: "1em",
    border: 0,
    transition: "0.4s",
    borderRadius: 5,
    color: "#fbf9f9",
    transition: "background-color 0.4s",
    ":hover": {
      backgroundColor: "#ff5050",
      transition: "0.4s",
    },
    ":focus": {
      outline: "none",
    },
    ":disabled": {
      backgroundColor: "rgb(245, 244, 242)",
      color: "rgb(177, 172, 163)",
    },
  },
  avatarWrapper: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
});
const useStyles = (theme) => ({
  input: {
    width: "100%",
  },
  appbar: {
    backgroundColor: "#263040",
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
});
class Modal extends Component {
  constructor() {
    super();
    this.state = { image: null };
    this.onCrop = this.onCrop.bind(this);
    this.onClose = this.onClose.bind(this);
  }
  onCrop(preview) {
    this.setState({ image: preview });
  }
  onClose() {
    this.setState({ image: null });
  }
  isMobile = () => {
    if (
      window.matchMedia("(max-width: 813px)").matches ||
      window.matchMedia("(max-width: 1025px) and (orientation: landscape)")
        .matches
    ) {
      return true;
    } else {
      return false;
    }
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={css(styles.container)}>
        <Dialog
          open={true}
          fullWidth={true}
          //   maxWidth={true}
          onClose={() => this.props.closeModal()}
          aria-labelledby="form-dialog-title"
          fullScreen={this.isMobile()}
        >
          {this.isMobile() ? (
            <AppBar className={classes.appbar} id="form-dialog-title">
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={this.props.closeModal}
                >
                  <Close />
                </IconButton>
                <Typography className={classes.title} variant="h6">
                  Redigera profil
                </Typography>
                <Button
                  color="inherit"
                  onClick={() => {
                    if (this.state.image !== null) {
                      this.props.upload(this.state.image);
                    }
                  }}
                  disabled={this.state.loading || this.state.image === null}
                >
                  {this.state.loading === true ? (
                    <i class="fas fa-sync fa-spin"></i>
                  ) : (
                    "Spara"
                  )}
                </Button>
              </Toolbar>
            </AppBar>
          ) : (
            <DialogTitle>Redigera profil</DialogTitle>
          )}

          <DialogContent>
            <div className={css(styles.avatarWrapper)}>
              <Avatar
                className={css(styles.avatarWrapper)}
                label="Välj en fil"
                width={390}
                height={295}
                onCrop={this.onCrop}
                onClose={this.onClose}
                src={URL.createObjectURL(this.props.image)}
              />
            </div>
          </DialogContent>
          {!this.isMobile() && (
            <DialogActions>
              <Button
                color="inherit"
                onClick={() => {
                  this.props.closeModal();
                }}
              >
                {this.state.loading === true ? (
                  <i class="fas fa-sync fa-spin"></i>
                ) : (
                  "Avbryt"
                )}
              </Button>
              <Button
                color="inherit"
                onClick={() => {
                  if (this.state.image !== null) {
                    this.props.upload(this.state.image);
                  }
                }}
                disabled={this.state.loading || this.state.image === null}
              >
                {this.state.loading === true ? (
                  <i class="fas fa-sync fa-spin"></i>
                ) : (
                  "Spara"
                )}
              </Button>
            </DialogActions>
          )}
        </Dialog>
      </div>
    );
  }
}

export default withStyles(useStyles)(Modal);
