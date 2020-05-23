import React, { Component } from "react";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { Column, Row } from "simple-flexbox";
import { StyleSheet, css } from "aphrodite";
import Player from "../vanilla-player/Player";
import TagsInput from "react-tagsinput";
import { Auth, Hub, Storage, API, graphqlOperation } from "aws-amplify";
const styles = StyleSheet.create({
  modal: {
    height: "100%",
    width: "100%",
    background: "#263040",
    position: "fixed",
    zIndex: 9999999,
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
});

function validate(title, desc, tags, connect) {
  return {
    title: title.length === 0,
    desc: desc.length === 0,
    tags: tags.length === 0,
    connect: connect.length === 0,
  };
}

class MobileModal extends Component {
  constructor() {
    super();
    this.state = {
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
    };
    this.playerRef = React.createRef();
  }
  componentDidMount() {
    this.refs.fileUploader.click();
  }
  componentWillUnmount() {}
  shouldMarkError = (field) => {
    const hasError = validate(
      this.state.title,
      this.state.desc,
      this.state.tags,
      this.state.connect
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
    Storage.put(`input/hello.mp4`, this.state.video, {
      progressCallback(progress) {
        console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
      },
    }).then((result) => {});
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
    const errors = validate(
      this.state.title,
      this.state.desc,
      this.state.tags,
      this.state.connect
    );
    const isDisabled = Object.keys(errors).some((x) => errors[x]);
    return (
      <div className={css(styles.modal)}>
        {this.state.videoMounted === false && (
          <div className={css(styles.videoUploadWrapper)}></div>
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
      </div>
    );
  }
}

export default MobileModal;
