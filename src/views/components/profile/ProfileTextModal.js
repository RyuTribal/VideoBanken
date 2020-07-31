import React, { Component } from "react";
import { StyleSheet, css } from "aphrodite";
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
  input: {
    width: "100%",
  },
  inputText: {
    fontSize: 20,
  },
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
  closeModal: {
    flex: 1,
    cursor: "pointer",
  },
  profileContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  profileWrapper: {
    maxWidth: 400,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
  },
});
const heightMarks = [
  {
    value: 115,
    label: "115cm",
  },
  {
    value: 130,
    label: "130cm",
  },
  {
    value: 145,
    label: "145cm",
  },
  {
    value: 160,
    label: "160cm",
  },
  {
    value: 175,
    label: "175cm",
  },
  {
    value: 190,
    label: "190cm",
  },
  {
    value: 205,
    label: "205cm",
  },
  {
    value: 220,
    label: "220cm",
  },
  {
    value: 235,
    label: "235cm",
  },
];
const weightMarks = [
  {
    value: 0,
    label: "0kg",
  },
  {
    value: 20,
    label: "20kg",
  },
  {
    value: 40,
    label: "40kg",
  },
  {
    value: 60,
    label: "60kg",
  },
  {
    value: 80,
    label: "80kg",
  },
  {
    value: 100,
    label: "100kg",
  },
  {
    value: 120,
    label: "120kg",
  },
  {
    value: 140,
    label: "140kg",
  },
  {
    value: 160,
    label: "160kg",
  },
];
const CustomSlider = withStyles({
  thumb: {
    backgroundColor: "rgb(38, 48, 64)",
  },
  active: {},
  valueLabel: {
    "& *": {
      background: "rgb(38, 48, 64)",
    },
  },
  rail: {
    backgroundColor: "rgb(38, 48, 64)",
  },
  mark: {
    backgroundColor: "#bfbfbf",
    height: 8,
    width: 1,
    marginTop: -3,
  },
  markActive: {
    opacity: 1,
    backgroundColor: "rgb(38, 48, 64)",
  },
  markLabel: {
    fontSize: 8,
  },
})(Slider);
const CustomTextField = withStyles({
  root: {
    "& input": {
      fontSize: 15,
      borderColor: "#a18e78",
      backgroundColor: "rgb(245, 244, 242)",
    },
    "& .MuiInputBase-multiline": {
      fontSize: 15,
      borderColor: "#a18e78",
      backgroundColor: "rgb(245, 244, 242)",
    },
    "& input:valid:focus": {
      backgroundColor: "transparent !important",
    },
    "& .Mui-focused": {
      backgroundColor: "transparent !important",
    },
  },
})(TextField);
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
function heightvaluetext(value) {
  return `${value}cm`;
}
function weightvaluetext(value) {
  return `${value}kg`;
}
function validate(name) {
  return {
    name: name.length === 0,
  };
}
class Modal extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      desc: "",
      height: 115,
      weight: 0,
      everFocusedName: false,
      inFocus: "",
      touched: {
        name: false,
      },
      nameErrorMessage: "Detta fält kan inte vara tomt",
      nameError: false,
      loading: false,
    };
  }
  componentDidMount = () => {
    this.setState({
      name: this.props.userProfile.fullName,
      height: this.props.userProfile.height,
      weigth: this.props.userProfile.weight,
      desc: this.props.userProfile.description
        ? this.props.userProfile.description
        : "",
    });
  };
  shouldMarkError = (field) => {
    const hasError = validate(this.state.name)[field];
    const shouldShow = this.state.touched[field];
    return hasError ? shouldShow : false;
  };
  handleNameChange = (evt) => {
    this.setState({ name: evt.target.value });
  };
  handleDescChange = (evt) => {
    this.setState({ desc: evt.target.value });
  };
  handleBlur = (field) => (evt) => {
    this.setState({
      touched: { ...this.state.touched, [field]: true },
    });
  };
  canBeSubmitted = () => {
    const errors = validate(this.state.name);
    const isDisabled = Object.keys(errors).some((x) => errors[x]);
    return !isDisabled;
  };
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
    const errors = validate(this.state.name);
    const isDisabled = Object.keys(errors).some((x) => errors[x]);
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
                  // onClick={() => {
                  //   if (this.state.image !== null) {
                  //     this.props.upload(this.state.image);
                  //   }
                  // }}
                  disabled={this.state.loading || isDisabled}
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
            <ThemeProvider theme={theme}>
              <div className="input-wrappers">
                <CustomTextField
                  className={classes.input}
                  id="outlined-password-input"
                  label="Namn"
                  type="text"
                  fullWidth
                  variant="outlined"
                  onKeyDown={this.checkForEnter}
                  value={this.state.name}
                  onChange={this.handleNameChange}
                  onBlur={this.handleBlur("name")}
                  onKeyDown={this.checkForEnter}
                  InputProps={{
                    style: { fontSize: 15 },
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    required: true,
                    error: this.state.nameError,
                  }}
                ></CustomTextField>
              </div>
              <div className="input-wrappers">
                <CustomTextField
                  className={classes.input}
                  id="outlined-password-input"
                  label="Beskrivning"
                  type="text"
                  variant="outlined"
                  onKeyDown={this.checkForEnter}
                  value={this.state.desc}
                  onChange={this.handleDescChange}
                  onBlur={this.handleBlur("desc")}
                  multiline
                  onKeyDown={this.checkForEnter}
                  InputProps={{
                    style: { fontSize: 15 },
                  }}
                  InputLabelProps={{
                    style: { fontSize: 15 },
                    required: true,
                    error: this.state.nameError,
                  }}
                ></CustomTextField>
              </div>
            </ThemeProvider>
            <div className="input-wrappers">
              <lable for="height">Längd</lable>
              <CustomSlider
                defaultValue={this.state.height ? this.state.height : 115}
                getAriaValueText={heightvaluetext}
                aria-labelledby="discrete-slider-always"
                step={1}
                marks={heightMarks}
                min={115}
                max={235}
                valueLabelDisplay="auto"
              />
            </div>
            <div className="input-wrappers">
              <lable for="weight">Vikt</lable>
              <CustomSlider
                defaultValue={this.state.weight ? this.state.weight : 0}
                getAriaValueText={weightvaluetext}
                aria-labelledby="discrete-slider-always"
                step={1}
                marks={weightMarks}
                max={160}
                valueLabelDisplay="auto"
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
                // onClick={() => {
                //   if (this.state.image !== null) {
                //     this.props.upload(this.state.image);
                //   }
                // }}
                disabled={this.state.loading || isDisabled}
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
