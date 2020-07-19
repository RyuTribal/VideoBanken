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

function validate(title, desc, tags) {
  return {
    title: title.length === 0,
    desc: desc.length === 0,
    tags: tags.length === 0,
  };
}

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
    const hasError = validate(
      this.state.title,
      this.state.desc,
      this.state.tags
    )[field];
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
        graphqlOperation(queries.getTableIncrement, { table: "Videos" })
      ).then((res) => {
        console.log(res);
        this.setState({ uploadBar: true });
        let that = this;
        Storage.put(
          `${res.data.getTableIncrement.AUTO_INCREMENT}.mp4`,
          this.state.videoBlob,
          {
            progressCallback(progress) {
              let loadedPer = (progress.loaded / progress.total) * 100;
              that.setState({ uploadPercent: loadedPer });
            },
          }
        ).then(() => {
          Storage.vault
            .put(`thumbnails/customThumbnail.jpg`, this.state.thumbBlob, {
              bucket: "vod-destination-1uukav97fprkq",
              level: "public",
              customPrefix: {
                public: `${res.data.getTableIncrement.AUTO_INCREMENT}/`,
              },
              progressCallback(progress) {
                console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
              },
            })
            .then(() => {
              API.graphql(
                graphqlOperation(mutations.addVideo, {
                  input: {
                    title: this.state.title,
                    description: this.state.desc,
                    username: this.props.state.user.username,
                    connection: this.state.connect,
                  },
                })
              ).then(() => {
                this.closeModal();
              });
            });
        });
      });
    }
  };
  closeModal = () => {
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
    this.props.closeModal();
  };
  render() {
    const errors = validate(this.state.title, this.state.desc, this.state.tags);
    const isDisabled = Object.keys(errors).some((x) => errors[x]);
    return (
      <div className={css(styles.modal)}>
        {!this.state.uploadBar ? (
          <div>
            <div className={css(styles.navbar)}>
              <button onClick={this.closeModal} className={css(styles.cancel)}>
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                disabled={
                  isDisabled || !this.state.thumbnailMounted ? true : false
                }
                className={css(styles.upload)}
                onClick={this.uploadVideo}
              >
                <i className="fas fa-check"></i>
              </button>
            </div>
            <div className={css(styles.videoUploadWrapper)}>
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
              <div className={css(styles.inputContainer)}>
                <div className={css(styles.thumbnailContainer)}>
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
    );
  }
}

export default MobileModal;
