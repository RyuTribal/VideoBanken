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
const styles = StyleSheet.create({
  modal: {
    minHeight: "720px",
    minWidth: "1280px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "#F7F8FC",
    "z-index": "90001",
    "@media (max-width: 1281px)": {
      minWidth: "unset",
      width: "100%",
      minHeight: "unset",
    },
  },
  overlay: {
    position: "fixed",
    height: "100%",
    width: "100%",
    background: "rgba(0,0,0,0.7)",
    "z-index": "90000",
  },
  modalContent: {
    height: "100%",
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-between",
    "@media (max-width: 1281px)": {
      flexDirection: "column",
      paddingTop: 20,
    },
  },
  modalInnerContent: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
    width: "49%",
    "@media (max-width: 1281px)": {
      width: "100%",
    },
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
  },
  tagsRemove: {
    background: "transparent",
    color: "#F7F8FC",
    width: 5,
    height: 5,
    cursor: "pointer",
    marginLeft: 10,
  },
  closeModal: {
    fontSize: "20px",
    textAlign: "end",
    cursor: "pointer",
  },
  buttonContainer: {
    width: "100%",
    display: "flex",
    padding: 20,
  },
  confirmButton: {
    marginLeft: "auto",
    marginRight: 0,
    background: "#ea3a3a",
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
    "@media (max-width: 1281px)": {
      width: "100%",
    },
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

function validate(title) {
  return {
    title: title.length === 0,
  };
}

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
  dropRef = React.createRef();
  imageDropRef = React.createRef();
  componentDidMount() {
    let div = this.dropRef.current;
    this.dragCounter = 0;
    div.addEventListener("dragenter", this.handleDragIn);
    div.addEventListener("dragleave", this.handleDragOut);
    div.addEventListener("dragover", this.handleDrag);
    div.addEventListener("drop", this.handleDrop);
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

  handleImageDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  handleImageDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.imageDragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({ imageDragging: true });
    }
  };
  handleImageDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.imageDragCounter--;
    if (this.imageDragCounter > 0) return;
    this.setState({ imageDragging: false });
  };
  handleImageDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ imageDragging: false });
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.setState({
        thumbnail: URL.createObjectURL(e.dataTransfer.files[0]),
        thumbBlob: e.target.files[0],
        thumbnailMounted: true,
      });
      e.dataTransfer.clearData();
      this.imageDragCounter = 0;
    }
  };

  handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({ dragging: true });
    }
  };
  handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.dragCounter--;
    if (this.dragCounter > 0) return;
    this.setState({ dragging: false });
  };
  handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({ dragging: false });
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      this.setState(
        {
          video: URL.createObjectURL(e.dataTransfer.files[0]),
          videoBlob: e.target.files[0],
          videoMounted: true,
        },
        () => {
          this.addThumbnailDrag();
        }
      );
      e.dataTransfer.clearData();
      this.dragCounter = 0;
    }
  };
  handleVideoClick = () => {
    this.refs.fileUploader.click();
  };
  handleImageClick = () => {
    this.refs.imageUploader.click();
  };
  handleVideoUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState(
      {
        video: URL.createObjectURL(e.target.files[0]),
        videoBlob: e.target.files[0],
        videoMounted: true,
      },
      () => {
        this.addThumbnailDrag();
      }
    );
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
      let div = this.dropRef.current;
      div.removeEventListener("dragenter", this.handleDragIn);
      div.removeEventListener("dragleave", this.handleDragOut);
      div.removeEventListener("dragover", this.handleDrag);
      div.removeEventListener("drop", this.handleDrop);

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
    return (
      <div className={css(styles.overlay)}>
        <div className={css(styles.modal)}>
          {!this.state.uploadBar ? (
            <div className={css(styles.modalContent)}>
              <div className={css(styles.modalInnerContent)}>
                <h1>Ladda upp video</h1>
                <div
                  ref={this.dropRef}
                  className={css(
                    styles.videoUploadContainer,
                    this.state.dragging === true && styles.videoUploadDragging
                  )}
                >
                  <div
                    className={css(
                      styles.innerVideoUploadContainer,
                      this.state.videoMounted === false &&
                        styles.unmountedContainer
                    )}
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
                      <div className={css(styles.dragVideo)}>
                        <i
                          onClick={this.handleVideoClick}
                          className="fas fa-film"
                          style={{ fontSize: 50, cursor: "pointer" }}
                        ></i>
                        <p style={{ fontSize: 15, fontWeight: 1000 }}>
                          Droppa din fil här
                        </p>
                        <p style={{ fontSize: 13, color: "#bf9c96" }}>eller</p>
                        <button
                          onClick={this.handleVideoClick}
                          className={css(styles.submitButton)}
                        >
                          Bläddra
                        </button>
                      </div>
                    )}
                    <input
                      id="video-uploader"
                      type="file"
                      className="upload"
                      accept="video/*"
                      style={{ display: "none" }}
                      ref="fileUploader"
                      onChange={this.handleVideoUpload}
                    ></input>
                    <input
                      id="image-uploader"
                      type="file"
                      className="upload"
                      accept="image/*"
                      style={{ display: "none" }}
                      ref="imageUploader"
                      onChange={this.handleImageUpload}
                    ></input>
                  </div>
                </div>
                {this.state.videoMounted === true && (
                  <div className={css(styles.thumbnailWrapper)}>
                    <p className={css(styles.notice)}>
                      För att byta video droppa en ny fil på nuvarande videon
                      eller {` `}
                      <span
                        className={css(styles.link)}
                        onClick={this.handleVideoClick}
                      >
                        Bläddra
                      </span>
                    </p>
                    <div className={css(styles.thumbnailContainer)}>
                      <div
                        ref={this.imageDropRef}
                        className={css(
                          styles.thumbnail,
                          this.state.imageDragging && styles.videoUploadDragging
                        )}
                      >
                        {this.state.thumbnailMounted && (
                          <img
                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                            src={this.state.thumbnail}
                          ></img>
                        )}
                      </div>
                      <span
                        className={css(styles.link)}
                        onClick={this.handleImageClick}
                        style={{ marginTop: "1.5rem" }}
                      >
                        Bläddra thumbnails
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className={css(styles.modalInnerContent)}>
                <h1
                  onClick={() => this.closeModal()}
                  className={css(styles.closeModal)}
                >
                  <i className="fas fa-times"></i>
                </h1>
                <div style={{ marginTop: 10 }} className="input-wrappers">
                  <lable for="title">Titel</lable>
                  <input
                    type="text"
                    className={
                      this.shouldMarkError("title") ||
                      this.state.titleError === true
                        ? "input-error custom-input"
                        : "custom-input"
                    }
                    id="title"
                    value={this.state.title}
                    onChange={this.handleTitleChange}
                    onBlur={this.handleBlur("title")}
                    onKeyDown={this.checkForEnter}
                    autoFocus
                  ></input>
                  {this.state.titleError ||
                    (this.shouldMarkError("title") && (
                      <p className="input-error-message">
                        {this.state.titleErrorMessage}
                      </p>
                    ))}
                </div>
                <div style={{ marginTop: 10 }} className="input-wrappers">
                  <lable for="desc">Beskrivning</lable>
                  <textarea
                    className={
                      this.shouldMarkError("desc") ||
                      this.state.descError === true
                        ? "input-error custom-input"
                        : "custom-input"
                    }
                    id="desc"
                    value={this.state.desc}
                    onChange={this.handleDescChange}
                    onBlur={this.handleBlur("desc")}
                    onKeyDown={this.checkForEnter}
                  ></textarea>
                  {this.state.descError ||
                    (this.shouldMarkError("desc") && (
                      <p className="input-error-message">
                        {this.state.descErrorMessage}
                      </p>
                    ))}
                </div>
                <div
                  onBlur={this.handleBlur("tags")}
                  style={{ marginTop: 10 }}
                  className="input-wrappers"
                >
                  <lable for="tags">Taggar</lable>
                  <TagsInput
                    className={
                      this.shouldMarkError("tags") ||
                      this.state.tagsError === true
                        ? "input-error custom-input"
                        : "custom-input"
                    }
                    tagProps={{
                      className: css(styles.tagWrapper),
                      classNameRemove: css(styles.tagsRemove),
                    }}
                    inputProps={{
                      placeholder: "",
                      className: css(styles.tagInput),
                    }}
                    addKeys={[32]}
                    id="tags"
                    onlyUnique={true}
                    onChange={this.handleTagsChange}
                    value={this.state.tags}
                    renderTag={this.customRenderTag}
                  />
                  {this.state.tagsError ||
                    (this.shouldMarkError("tags") && (
                      <p className="input-error-message">
                        {this.state.tagsErrorMessage}
                      </p>
                    ))}
                </div>
                <div style={{ marginTop: 10 }} className="input-wrappers">
                  <lable for="connect">Connections</lable>
                  <input
                    type="text"
                    className={
                      this.shouldMarkError("connect") ||
                      this.state.connectError === true
                        ? "input-error custom-input"
                        : "custom-input"
                    }
                    id="connect"
                    value={this.state.connect}
                    onChange={this.handleConnectChange}
                    onBlur={this.handleBlur("connect")}
                    onKeyDown={this.checkForEnter}
                  ></input>
                  {this.state.connectError ||
                    (this.shouldMarkError("connect") && (
                      <p className="input-error-message">
                        {this.state.connectErrorMessage}
                      </p>
                    ))}
                </div>
              </div>
              <div className={css(styles.buttonContainer)}>
                <button
                  disabled={
                    isDisabled ||
                    !this.state.thumbnailMounted ||
                    !this.state.videoMounted
                      ? true
                      : false
                  }
                  onClick={this.uploadVideo}
                  className={css(styles.confirmButton)}
                >
                  Ladda upp
                </button>
              </div>
            </div>
          ) : (
            <div className={css(styles.modalCenter)}>
              <div className={css(styles.uploadBarWrapper)}>
                <h3>Uppladdning pågår</h3>
                <div className={css(styles.uploadBar)}>
                  <div
                    style={{ width: `${this.state.uploadPercent}%` }}
                    className={css(styles.uploadProgress)}
                  ></div>
                </div>
                <div className={css(styles.uploadPercent)}>
                  {`${Math.floor(this.state.uploadPercent)} %`}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(Modal);
