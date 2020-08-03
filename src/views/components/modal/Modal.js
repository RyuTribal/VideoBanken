import React, { Component } from "react";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { Column, Row } from "simple-flexbox";
import { StyleSheet, css } from "aphrodite";
import Player from "../vanilla-player/Player";
import TagsInput from "react-tagsinput";
import { Auth, Hub, Storage, API, graphqlOperation } from "aws-amplify";
import * as queries from "../../../graphql/queries";
import * as mutations from "../../../graphql/mutations";
import { connect } from "react-redux";
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
import { FileDrop } from "react-file-drop";

function validate(title) {
  return {
    title: title.length === 0,
  };
}
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
const useStyles = (theme) => ({
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  modalContent: {
    height: "100%",
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalInnerContent: {
    display: "flex",
    flexDirection: "column",
    width: "50%",
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
    marginLeft: "auto",
    marginRIght: 0,
    textAlign: "center",
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
class Modal extends Component {
  constructor() {
    super();
    this.state = {
      dragging: false,
      imageDragging: false,
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
      },
      titleErrorMessage: "Detta fält kan inte vara tomt",
      titleError: false,
      descErrorMessage: "Detta fält kan inte vara tomt",
      descError: false,
      tagsErrorMessage: "Detta fält kan inte vara tomt",
      tagsError: false,
      uploadBar: false,
      uploadPercent: 0,
    };
    this.playerRef = React.createRef();
  }
  imageDropRef = React.createRef();
  componentDidMount() {
    this.dragCounter = 0;
  }
  componentWillUnmount() {}

  isMobile = () => {
    if (window.matchMedia("(max-width: 1281px)").matches) {
      return true;
    } else {
      return false;
    }
  };

  addThumbnailDrag = () => {
    let imageDiv = this.imageDropRef.current;
    this.imageDragCounter = 0;
    imageDiv.addEventListener("dragenter", this.handleImageDragIn);
    imageDiv.addEventListener("dragleave", this.handleImageDragOut);
    imageDiv.addEventListener("dragover", this.handleImageDrag);
    imageDiv.addEventListener("drop", this.handleImageDrop);
  };
  handleVideoClick = () => {
    this.refs.fileUploader.click();
  };
  handleImageClick = () => {
    this.refs.imageUploader.click();
  };
  handleVideoUpload = (files) => {
    this.setState({
      video: URL.createObjectURL(files[0]),
      videoBlob: files[0],
      videoMounted: true,
      dragging: false,
    });
  };
  handleImageUpload = (files) => {
    this.setState({
      thumbnail: URL.createObjectURL(files[0]),
      thumbBlob: files[0],
      thumbnailMounted: true,
      imageDragging: false,
    });
  };
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
    this.setState({ tags: tags });
  };
  handleConnectChange = (evt) => {
    this.setState({ connect: evt.target.value });
  };
  handleBlur = (field) => (evt) => {
    this.setState({
      touched: { ...this.state.touched, [field]: true },
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
      this.state.videoMounted &&
      this.state.thumbnailMounted
    ) {
      let imageDiv = this.imageDropRef.current;
      if (imageDiv) {
        imageDiv.removeEventListener("dragenter", this.handleImageDragIn);
        imageDiv.removeEventListener("dragleave", this.handleImageDragOut);
        imageDiv.removeEventListener("dragover", this.handleImageDrag);
        imageDiv.removeEventListener("drop", this.handleImageDrop);
      }
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
      dragging: false,
      imageDragging: false,
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
    console.log(isUploaded);
    this.props.closeModal(isUploaded);
  };
  dataURItoBlob = (dataURI) => {
    let byteString = atob(dataURI.split(",")[1]);

    let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };
  render() {
    console.log(this.state.uploadPercent);
    const errors = validate(this.state.title);
    const isDisabled = Object.keys(errors).some((x) => errors[x]);
    const { classes } = this.props;
    return (
      <Dialog
        open={true}
        fullWidth={true}
        maxWidth={true}
        onClose={() => this.props.closeModal()}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>Ladda upp video</DialogTitle>
        <DialogContent>
          {!this.state.uploadBar ? (
            <Grid className={classes.modalContent} container spacing={3}>
              <Grid item className={classes.modalInnerContent}>
                <FileDrop
                  className={
                    (classes.videoUploadContainer,
                    this.state.dragging === true && classes.videoUploadDragging)
                  }
                  onDragOver={(event) => this.setState({ dragging: true })}
                  onDragLeave={(event) => this.setState({ dragging: false })}
                  onDrop={(files, event) => this.handleVideoUpload(files)}
                >
                  <div
                    className={
                      (classes.innerVideoUploadContainer,
                      this.state.videoMounted === false &&
                        classes.unmountedContainer)
                    }
                  >
                    {this.state.videoMounted === true ? (
                      <Player
                        shortcuts={false}
                        settings={false}
                        pip={false}
                        fullscreen={false}
                        timeThumb={false}
                        ref={this.playerRef}
                        video={this.state.video}
                        thumbnailCreator={true}
                        sendThumbnail={(dataURL) => {
                          let dataBlob = this.dataURItoBlob(dataURL);
                          this.setState({
                            thumbnail: dataURL,
                            thumbBlob: dataBlob,
                            thumbnailMounted: true,
                          });
                        }}
                      />
                    ) : (
                      <div className={classes.dragVideo}>
                        <i
                          onClick={this.handleVideoClick}
                          className="fas fa-film"
                          style={{ fontSize: 50, cursor: "pointer" }}
                        ></i>
                        <p style={{ fontSize: 15, fontWeight: 1000 }}>
                          Droppa din fil här
                        </p>
                        <p style={{ fontSize: 13, color: "#bf9c96" }}>eller</p>
                        <Button
                          onClick={this.handleVideoClick}
                          className={classes.submitButton}
                        >
                          Bläddra
                        </Button>
                      </div>
                    )}
                    <input
                      id="video-uploader"
                      type="file"
                      className="upload"
                      accept="video/*"
                      style={{ display: "none" }}
                      ref="fileUploader"
                      onChange={(e) => this.handleVideoUpload(e.target.files)}
                    ></input>
                    <input
                      id="image-uploader"
                      type="file"
                      className="upload"
                      accept="image/*"
                      style={{ display: "none" }}
                      ref="imageUploader"
                      onChange={(e) => this.handleImageUpload(e.target.files)}
                    ></input>
                  </div>
                </FileDrop>
                {this.state.videoMounted === true && (
                  <div className={classes.thumbnailWrapper}>
                    <p className={classes.notice}>
                      För att byta video droppa en ny fil på nuvarande videon
                      eller {` `}
                      <span
                        className={classes.link}
                        onClick={this.handleVideoClick}
                      >
                        Bläddra
                      </span>
                    </p>
                    <div className={classes.thumbnailContainer}>
                      <FileDrop
                        className={
                          this.state.imageDragging
                            ? [classes.videoUploadDragging, classes.thumbnail]
                            : classes.thumbnail
                        }
                        onDragOver={(event) =>
                          this.setState({ imageDragging: true })
                        }
                        onDragLeave={(event) =>
                          this.setState({ imageDragging: false })
                        }
                        onDrop={(files, event) => this.handleImageUpload(files)}
                      >
                        {this.state.thumbnailMounted && (
                          <img
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              position: "relative",
                            }}
                            src={this.state.thumbnail}
                          ></img>
                        )}
                      </FileDrop>
                      <span
                        className={classes.link}
                        onClick={this.handleImageClick}
                        style={{ marginTop: "1.5rem" }}
                      >
                        Bläddra thumbnails
                      </span>
                    </div>
                  </div>
                )}
              </Grid>
              <Grid item className={classes.modalInnerContent}>
                <ThemeProvider theme={theme}>
                  <div className="input-wrappers">
                    <CustomTextField
                      className={classes.input}
                      id="outlined-password-input"
                      label="Titel"
                      type="text"
                      fullWidth={true}
                      variant="outlined"
                      classes={{ focused: classes.inputFocused }}
                      onKeyDown={this.checkForEnter}
                      value={this.state.title}
                      onChange={this.handleTitleChange}
                      onBlur={this.handleBlur("title")}
                      onKeyDown={this.checkForEnter}
                      error={
                        this.state.titleError || this.shouldMarkError("title")
                      }
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
                      fullWidth={true}
                      type="text"
                      variant="outlined"
                      onKeyDown={this.checkForEnter}
                      value={this.state.desc}
                      onChange={this.handleDescChange}
                      onBlur={this.handleBlur("desc")}
                      multiline
                      onKeyDown={this.checkForEnter}
                      InputProps={{
                        style: {
                          fontSize: 15,
                        },
                      }}
                      InputLabelProps={{
                        style: { fontSize: 15 },
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

                    {this.state.tagsError ||
                      (this.shouldMarkError("tags") && (
                        <p className="input-error-message">
                          {this.state.tagsErrorMessage}
                        </p>
                      ))}
                  </div>
                  <div style={{ marginTop: 10 }} className="input-wrappers">
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
                </ThemeProvider>
              </Grid>
            </Grid>
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
          {!this.state.uploadBar && (
            <DialogActions>
              <Button onClick={() => this.props.closeModal()} color="inherit">
                Avbryt
              </Button>
              <Button
                disabled={
                  isDisabled ||
                  !this.state.thumbnailMounted ||
                  !this.state.videoMounted
                    ? true
                    : false
                }
                onClick={this.uploadVideo}
                color="inherit"
              >
                Ladda upp
              </Button>
            </DialogActions>
          )}
        </DialogContent>
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    state: state,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    set_rooms: (rooms) => dispatch({ type: "SET_ROOMS", rooms: rooms }),
    add_room: (room) => dispatch({ type: "ADD_ROOM", room: room }),
    remove_room: (id) => dispatch({ type: "REMOVE_ROOM", id, id }),
    add_subscription: (subscription) =>
      dispatch({ type: "ADD_SUBSCRIPTION", subscription: subscription }),
    remove_subscription: (id) =>
      dispatch({ type: "REMOVE_SUBSCRIPTION", id: id }),
    add_message: (message) =>
      dispatch({ type: "ADD_MESSAGE", message: message }),
    change_room: (id) => dispatch({ type: "CHANGE_ROOM", id: id }),
    clear_selected_room: () => dispatch({ type: "CLEAR_SELECTED_ROOM" }),
  };
}
export default withStyles(useStyles)(
  connect(mapStateToProps, mapDispatchToProps)(Modal)
);
