import React, { Component } from "react";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { Column, Row } from "simple-flexbox";
import { StyleSheet, css } from "aphrodite";
import TagsInput from "react-tagsinput";
import { Auth, Hub, Storage, API, graphqlOperation } from "aws-amplify";
import * as queries from "../../../graphql/queries";
import * as mutations from "../../../graphql/mutations";
import Player from "../vanilla-player/Player";
import ChipInput from "material-ui-chip-input";
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
  Box,
  Portal,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
  Grid,
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
    width: "100%",
    background: "#fbf9f9",
    position: "fixed",
    zIndex: 9999999,
    overflowY: "auto",
  },
  videoUploadWrapper: {
    height: "100%",
    width: "100%",
  },
  submitButton: {
    background: "#ea3a3a",
    width: "100%",
    padding: "10px 20px",
    boxSizing: "border-box",
    fontSize: 20,
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
  editVideo: {
    width: "100%",
    position: "relative",
    height: "auto",
  },
  tagInput: {
    background: "transparent",
    border: "none",
    outline: "none",
    marginTop: 5,
    marginBottom: 5,
  },
  tagWrapper: {
    marginRight: "1.5rem",
    color: "#F7F8FC",
    background: "rgb(38, 48, 64)",
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 5,
    marginBottom: 5,
    "@media (max-width: 376px)": {
      fontSize: 11,
    },
  },
  tagsRemove: {
    background: "transparent",
    color: "#F7F8FC",
    width: 5,
    height: 5,
    cursor: "pointer",
    marginLeft: 10,
  },
  inputContainer: {
    padding: 20,
  },
  navbar: {
    position: "sticky",
    top: 0,
    width: "100%",
    display: "flex",
    zIndex: 6,
    background: "#263040",
  },

  cancel: {
    marginRight: "auto",
    padding: 10,
    color: "#fbf9f9",
    background: "transparent",
    border: "none",
  },
  upload: {
    marginLeft: "auto",
    background: "transparent",
    padding: 10,
    border: "none",
    color: "rgb(234, 58, 58)",
    ":disabled": {
      color: "rgb(177, 172, 163)",
    },
  },
  thumbnailContainer: {
    marginLeft: "0",
    marginRight: "0",
  },
  thumbnail: {
    width: 150,
    height: 84,
    background: "rgb(245, 244, 242)",
  },
  modalCenter: {
    minHeight: 720,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadBarWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    width: "100%",
  },
  uploadBar: {
    width: "100%",
    height: 25,
    border: "1px solid rgb(191, 156, 150)",
    borderRadius: 12,
    overflow: "hidden",
  },
  uploadProgress: {
    backgroundColor: "rgb(234, 58, 58)",
    transition: "width 2s",
    height: "100%",
  },
});

function validate(title) {
  return {
    title: title.length === 0,
  };
}
const CustomChipField = withStyles({
  chipContainer: {
    fontSize: 15,
    borderColor: "#a18e78",
    backgroundColor: "rgb(245, 244, 242)",
    "&:focus": {
      backgroundColor: "transparent !important",
    },
  },
  focused: {
    backgroundColor: "transparent !important",
  },
  chip: {
    backgroundColor: "rgb(38, 48, 64)",
    border: "1px solid rgb(38, 48, 64)",
    color: "#fbf9f9",
    "& .MuiChip-deleteIcon path": {
      fill: "#fbf9f9 !important",
    },
    "&:hover": {
      color: "rgb(38, 48, 64)",
      backgroundColor: "#fbf9f9",
      "& .MuiChip-deleteIcon path": {
        fill: "rgb(38, 48, 64) !important",
      },
    },
  },
})(ChipInput);
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
  modal: {
    padding: 0,
  },
  formWrapper: {
    padding: "0px 24px",
  },
  videoUploadContainer: {
    paddingTop: "56.25%",
    width: "100%",
    borderRadius: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgb(245, 244, 242)",
    transition: "0.4s",
    position: "relative",
  },
  innerVideoUploadContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    "@media (max-width: 1281px)": {
      position: "static",
    },
  },
  unmountedContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgb(245, 244, 242)",
    paddingTop: "56.25%",
    position: "relative",
  },
  videoUploadDragging: {
    background: "#F7F8FC",
    transition: "0.4s",
    border: "3px dashed grey",
  },
  dragVideo: {
    display: "inline-block",
    textAlign: "center",
    fontFamily: "Muli",
    position: "absolute",
    top: "25%",
    bottom: "25%",
    left: "25%",
    right: "25%",
  },
  submitButton: {
    background: "#ea3a3a",
    width: "100%",
    padding: "10px 20px",
    boxSizing: "border-box",
    fontSize: 15,
    border: 0,
    transition: "0.4s",
    borderRadius: 5,
    color: "#fbf9f9",
    transition: "background-color 0.4s",
    "&:hover": {
      backgroundColor: "#ff5050",
      transition: "0.4s",
    },
    "&:focus": {
      outline: "none",
    },
    "&:disabled": {
      backgroundColor: "rgb(245, 244, 242)",
      color: "rgb(177, 172, 163)",
    },
  },
  thumbnailWrapper: {
    display: "flex",
    marginTop: 10,
  },
  link: {
    color: "#f44336",
    textDecoration: "underline",
    cursor: "pointer",
  },
  notice: {
    color: "rgb(177, 172, 163)",
  },
  thumbnailContainer: {
    marginLeft: "0",
    marginRight: "0",
    padding: "0px 24px",
  },
  thumbnail: {
    width: 150,
    height: 84,
    background: "rgb(245, 244, 242)",
  },
  tagInput: {
    background: "transparent",
    border: "none",
    outline: "none",
    display: "flex",
    alignItems: "center",
  },
  tagWrapper: {
    marginRight: "1.5rem",
    color: "#F7F8FC",
    background: "rgb(38, 48, 64)",
    borderRadius: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  tagsRemove: {
    background: "transparent",
    color: "#F7F8FC",
    width: 5,
    height: 5,
    cursor: "pointer",
    marginLeft: 10,
  },
  modalCenter: {
    minHeight: 720,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadBarWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    width: "100%",
  },
  uploadBar: {
    width: "100%",
    height: 25,
    border: "1px solid rgb(191, 156, 150)",
    borderRadius: 12,
    overflow: "hidden",
  },
  uploadProgress: {
    backgroundColor: "rgb(234, 58, 58)",
    height: "100%",
  },
});

class MobileModal extends Component {
  constructor() {
    super();
    this.state = {
      video: "",
      thumbnail: "",
      thumbnailMounted: false,
      title: "",
      everFocusedTitle: false,
      desc: "",
      everFocusedDesc: false,
      inFocus: "",
      tags: [],
      everFocusedTags: false,
      connect: "",
      everFocusedConnect: false,
      touched: {
        title: false,
        desc: false,
        tags: false,
        connect: false,
      },
      titleErrorMessage: "Detta fält kan inte vara tomt",
      titleError: false,
      descErrorMessage: "Detta fält kan inte vara tomt",
      descError: false,
      tagsErrorMessage: "Detta fält kan inte vara tomt",
      tagsError: false,
      connectErrorMessage: "Detta fält kan inte vara tomt",
      connectError: false,
      uploadBar: false,
      uploadPercent: 0,
    };
    this.playerRef = React.createRef();
  }
  componentDidMount() {
    this.setState({
      video: URL.createObjectURL(this.props.video),
      videoBlob: this.props.video,
    });
  }

  componentWillUnmount() {}
  shouldMarkError = (field) => {
    const hasError = validate(this.state.title)[field];
    const shouldShow = this.state.touched[field];
    return hasError ? shouldShow : false;
  };
  handleTitleChange = (evt) => {
    this.setState({ title: evt.target.value });
  };
  handleDescChange = (evt) => {
    this.setState({ desc: evt.target.value });
  };
  handleTagsChange = (tags) => {
    var lowerTags = tags.map((t) => t.toLowerCase());
    this.setState({ tags: lowerTags });
  };
  handleConnectChange = (evt) => {
    this.setState({ connect: evt.target.value });
  };
  handleBlur = (field) => (evt) => {
    this.setState({
      touched: { ...this.state.touched, [field]: true },
    });
  };
  handleImageUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      thumbnail: URL.createObjectURL(e.target.files[0]),
      thumbBlob: e.target.files[0],
      thumbnailMounted: true,
    });
  };
  customRenderTag(props) {
    let {
      tag,
      key,
      disabled,
      onRemove,
      classNameRemove,
      getTagDisplayValue,
      ...other
    } = props;
    return (
      <div style={{ display: "inline-block" }} key={key} {...other}>
        {`#`}
        {getTagDisplayValue(tag)}
        {!disabled && (
          <a className={classNameRemove} onClick={(e) => onRemove(key)}>
            <i className="fas fa-times"></i>
          </a>
        )}
      </div>
    );
  }
  uploadVideo = async () => {
    if (
      this.state.title.replace(/\s/g, "") !== "" &&
      this.state.thumbnailMounted
    ) {
      await API.graphql(
        graphqlOperation(mutations.getTableIncrement, { table: "Videos" })
      ).then((res) => {
        console.log(res);
        this.setState({ uploadBar: true });
        let that = this;
        let videoID = res.data.getTableIncrement.id;
        Storage.put(`${videoID}.mp4`, this.state.videoBlob, {
          progressCallback(progress) {
            let loadedPer = (progress.loaded / progress.total) * 100;
            that.setState({ uploadPercent: loadedPer });
          },
        }).then(() => {
          Storage.vault
            .put(`thumbnails/customThumbnail.jpg`, this.state.thumbBlob, {
              bucket: "vod-destination-1uukav97fprkq",
              level: "public",
              customPrefix: {
                public: `${videoID}/`,
              },
              progressCallback(progress) {
                console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
              },
            })
            .then(() => {
              API.graphql(
                graphqlOperation(mutations.addVideo, {
                  input: {
                    id: videoID,
                    title: this.state.title,
                    description: this.state.desc,
                    username: this.props.state.user.username,
                    connection: this.state.connect,
                  },
                })
              ).then(() => {
                this.closeModal(true);
              });
            });
        });
      });
    }
  };
  closeModal = (isUploaded) => {
    this.setState({
      video: "",
      videoMounted: false,
      thumbnail: "",
      thumbnailMounted: false,
      title: "",
      everFocusedTitle: false,
      desc: "",
      everFocusedDesc: false,
      inFocus: "",
      tags: [],
      everFocusedTags: false,
      connect: "",
      everFocusedConnect: false,
      touched: {
        title: false,
        desc: false,
        tags: false,
        connect: false,
      },
      titleErrorMessage: "Detta fält kan inte vara tomt",
      titleError: false,
      descErrorMessage: "Detta fält kan inte vara tomt",
      descError: false,
      tagsErrorMessage: "Detta fält kan inte vara tomt",
      tagsError: false,
      connectErrorMessage: "Detta fält kan inte vara tomt",
      connectError: false,
    });
    this.props.closeModal(isUploaded);
  };
  render() {
    const errors = validate(this.state.title);
    const isDisabled = Object.keys(errors).some((x) => errors[x]);
    const { classes } = this.props;
    console.log(isDisabled);
    return (
      <Dialog
        open={true}
        fullWidth={true}
        maxWidth={true}
        onClose={() => this.props.closeModal()}
        aria-labelledby="form-dialog-title"
        fullScreen={true}
      >
        {!this.state.uploadBar && (
          <AppBar className={classes.appbar} id="form-dialog-title">
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => this.props.closeModal(false)}
              >
                <Close />
              </IconButton>
              <Typography className={classes.title} variant="h6">
                Ladda upp video
              </Typography>
              <Button
                color="inherit"
                disabled={
                  isDisabled || !this.state.thumbnailMounted ? true : false
                }
                onClick={this.uploadVideo}
              >
                {this.state.loading === true ? (
                  <i class="fas fa-sync fa-spin"></i>
                ) : (
                  "Spara"
                )}
              </Button>
            </Toolbar>
          </AppBar>
        )}

        {!this.state.uploadBar ? (
          <DialogContent className={classes.modal}>
            <Player
              shortcuts={false}
              settings={false}
              pip={false}
              fullscreen={false}
              timeThumb={false}
              ref={this.playerRef}
              video={this.state.video}
              thumbnailCreator={false}
              mobileControls={true}
            />
            <input
              id="image-uploader"
              type="file"
              className="upload"
              accept="image/*"
              style={{ display: "none" }}
              ref="imageUploader"
              onChange={this.handleImageUpload}
            ></input>
            <div className={classes.thumbnailContainer}>
              <lable for="thumb">Thumbnail</lable>
              <div
                onClick={() => this.refs.imageUploader.click()}
                id="thumb"
                className={css(styles.thumbnail)}
              >
                {this.state.thumbnailMounted && (
                  <img
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                    src={this.state.thumbnail}
                  ></img>
                )}
              </div>
            </div>
            <ThemeProvider className={classes.formWrapper} theme={theme}>
              <div className={classes.formWrapper}>
                <div className="input-wrappers">
                  <CustomTextField
                    className={classes.input}
                    id="outlined-password-input"
                    label="Titel"
                    type="text"
                    fullWidth
                    variant="outlined"
                    onKeyDown={this.checkForEnter}
                    value={this.state.name}
                    onChange={this.handleTitleChange}
                    onBlur={this.handleBlur("title")}
                    onKeyDown={this.checkForEnter}
                    error={this.state.titleError || this.shouldMarkError("title")}
                    helperText={
                      this.state.titleError || this.shouldMarkError("title")
                        ? this.state.titleErrorMessage
                        : ""
                    }
                    InputProps={{
                      style: { fontSize: 15 },
                    }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      required: true,
                      error: this.state.titleError,
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
                      error: this.state.nameError,
                    }}
                  ></CustomTextField>
                </div>
                <div className="input-wrappers">
                  <CustomChipField
                    className={classes.input}
                    id="outlined-password-input"
                    label="Tags"
                    fullWidth={true}
                    classes={{ focused: classes.focused }}
                    newChipKeyCodes={[13, 32]}
                    variant="outlined"
                    onKeyDown={this.checkForEnter}
                    value={this.state.tags}
                    onBlur={() => {
                      this.handleBlur("tags");
                      this.setState({ tagsFocused: false });
                    }}
                    onAdd={(chip) => {
                      this.setState((prevState) => ({
                        tags: [...prevState.tags, `#${chip}`],
                      }));
                    }}
                    onDelete={(chip, index) => {
                      this.setState({
                        tags: this.state.tags.filter(function (tag) {
                          return tag !== chip;
                        }),
                      });
                    }}
                    onKeyDown={this.checkForEnter}
                    focused={this.state.tagsFocused}
                    style={{ padding: 0 }}
                    multiline
                    InputProps={{
                      style: { fontSize: 15 },
                    }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      error: this.state.tagsError,
                    }}
                  />
                </div>
                <div className="input-wrappers">
                  <CustomTextField
                    className={classes.input}
                    id="outlined-password-input"
                    label="Connections"
                    type="text"
                    fullWidth={true}
                    variant="outlined"
                    onKeyDown={this.checkForEnter}
                    value={this.state.connect}
                    onChange={this.handleConnectChange}
                    onBlur={this.handleBlur("connect")}
                    onKeyDown={this.checkForEnter}
                    InputProps={{
                      style: { fontSize: 15 },
                    }}
                    InputLabelProps={{
                      style: { fontSize: 15 },
                      error: this.state.connectError,
                    }}
                  ></CustomTextField>
                </div>
              </div>
            </ThemeProvider>
          </DialogContent>
        ) : (
          <div className={classes.modalCenter}>
            <div className={classes.uploadBarWrapper}>
              <h3>Uppladdning pågår</h3>
              <div className={classes.uploadBar}>
                <div
                  style={{ width: `${this.state.uploadPercent}%` }}
                  className={classes.uploadProgress}
                ></div>
              </div>
              <div className={classes.uploadPercent}>
                {`${Math.floor(this.state.uploadPercent)} %`}
              </div>
            </div>
          </div>
        )}
      </Dialog>
    );
  }
}

export default withStyles(useStyles)(MobileModal);
