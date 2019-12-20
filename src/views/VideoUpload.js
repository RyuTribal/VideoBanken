import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import noThumbnail from "../img/no-thumbnail.jpg";
import $ from "jquery";
import Amplify from "aws-amplify";
import { Auth, Hub, Storage, API, graphqlOperation } from "aws-amplify";
import awsconfig from "../aws-exports";
import * as queries from "../graphql/queries";
import * as mutations from "../graphql/mutations";

Storage.configure({ track: true });
let that;
class VideoUpload extends Component {
  constructor() {
    super();
    this.state = {
      user: ""
    };
  }
  user = "";
  async componentDidMount() {
    that = this
    console.log(this.state);
    await Auth.currentAuthenticatedUser({
      bypassCache: true // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    })
      .then(user => {
        console.log(user);
        this.user = user;
        if (
          user.attributes["custom:firstTime"] == "0" ||
          user.attributes["custom:firstTime"] == undefined
        ) {
          console.log("yeah here");

          API.graphql(
            graphqlOperation(mutations.createUserStorage, {
              input: {
                username: user.username,
                likedVideos: "[]",
                dislikedVideos: "[]"
              }
            })
          )
            .then(result => {
              Auth.updateUserAttributes(user, {
                "custom:firstTime": "1"
              }).catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => {
        console.log(err);
        this.props.history.push("/login");
      });
    $("#video-hashtags").on("keyup", function(event) {
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("add-tag").click();
      } else if (event.keyCode == 35) {
      }
    });
  }
  handleThumbnailUpload(event) {
    document
      .getElementById("thumbnail-uploader")
      .addEventListener("change", previewThumbnail, false);
    $("#thumbnail-uploader").trigger("click");
  }

  handleVideoUpload() {
    document
      .getElementById("video-uploader")
      .addEventListener("change", previewVideo, false);
    $("#video-uploader").trigger("click");
  }

  handleUpload() {
    var thumbnail = document.getElementById("thumbnail-uploader").files[0];
    var video = document.getElementById("video-uploader").files[0];
    var thumbtype = thumbnail.type.split("/")[1];
    var videotype = video.type.split("/")[1];
    var exists = false;
    Storage.list("uploads/").then(result => {
      var randomString = rndStr();
      console.log(randomString);
      for (var i = 0; i < result.length; i++) {
        if (
          result[i].key ==
          `uploads/${randomString}-${that.user.username}.${videotype}`
        ) {
          randomString = rndStr();
          i = 0;
          exists = true;
        } else {
          exists = false;
        }
      }
      if (exists == false) {
        var tagString = [];
        const videoDetails = {
          username: that.user.username,
          videoKey: `uploads/${randomString}-${that.user.username}.${videotype}`,
          videoDesc: $("#video-desc").val(),
          videoTitle: $("#video-title").val(),
          thumbKey: `uploads/${randomString}-${that.user.username}.${thumbtype}`,
          tags: JSON.stringify(["basketball"]),
          category: $(".category :selected").val(),
          createdAt: new Date().toISOString()
        };
        that.props.history.push("/home");
        $(".progress-bar").css("display", "block");
        $(".progress-bar").css("height", "20px");
        Storage.put(
          `uploads/${randomString}-${that.user.username}.${videotype}`,
          video,
          {
            progressCallback(progress) {
              console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
              var percentageVideo = Math.round(
                (progress.loaded / progress.total) * 100
              );
              $(".loader").css("width", `${percentageVideo}%`);
              $(".loader")
                .find("p")
                .text(`Video: ${percentageVideo}%`);
            }
          }
        )
          .then(result => {
            Storage.put(
              `uploads/${randomString}-${that.user.username}.${thumbtype}`,
              thumbnail,
              {
                progressCallback(progress) {
                  console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
                  var percentageImage = Math.round(
                    (progress.loaded / progress.total) * 100
                  );
                  $(".loader").css("width", `${percentageImage}%`);
                  $(".loader")
                    .find("p")
                    .text(`Thumbnail: ${percentageImage}%`);
                }
              }
            )
              .then(function(result) {
                console.log(videoDetails);
                $(".progress-bar").css("display", "none");
                $(".progress-bar").css("height", "0");
                $(".loader").css("width", "0");
                $(".loader")
                  .find("p")
                  .text("");
                const newVideo = API.graphql(
                  graphqlOperation(mutations.createVideoStorage, {
                    input: videoDetails
                  })
                )
                  .then(result => console.log(result))
                  .catch(err => console.log(err));
              })
              .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      }
    });
  }
  render() {
    return (
      <div className="video-upload-container">
        <div className="video-upload-file">
          <div className="row">
            <div className="col-md-12 video-upload-preview">
              <input
                id="video-uploader"
                type="file"
                className="upload"
                accept="video/*"
              ></input>
              <button
                className="thumbnail-upload-button"
                onClick={this.handleVideoUpload}
              >
                <i className="fas fa-file-video"></i> Ladda upp video
              </button>
            </div>
          </div>
          <div className="row">
            <div className="video-category col-md-12">
              <p className="file-name">(Ingen fil vald)</p>
              <select className="category">
                <option name="choice">Kategori</option>
                <option name="drill">Övning</option>
              </select>
            </div>
          </div>
        </div>
        <div className="video-details">
          <div className="row">
            <div className="col-md-12 thumbnail-preview-container">
              <img src={noThumbnail} className="thumbnail-preview"></img>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <input
                id="thumbnail-uploader"
                type="file"
                className="upload"
                accept="image/*"
              ></input>
              <button
                className="thumbnail-upload-button"
                onClick={this.handleThumbnailUpload}
              >
                <i className="fas fa-upload"></i> Ladda upp thumbnail
              </button>
            </div>
            <div className="row">
              <div className="col-md-12">
                <input
                  id="video-uploader"
                  type="file"
                  className="upload"
                ></input>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="label-error-wrapper">
                <label className="input-label" for="video-title">
                  Video Titel*:
                </label>
              </div>
              <div className="field-wrapper">
                <input
                  type="text"
                  id="video-title"
                  className="form-input"
                  name="video-title"
                />
              </div>
              <div className="error error-msg-pass">
                <p></p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="label-error-wrapper">
                <label className="input-label" for="video-desc">
                  Beskrivning*:
                </label>
              </div>
              <div className="field-wrapper">
                <textarea
                  id="video-desc"
                  className="form-input"
                  name="video-desc"
                ></textarea>
              </div>
              <div className="error error-msg-pass">
                <p></p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="label-error-wrapper">
                <label className="input-label" for="video-hashtags">
                  Hashtags:
                </label>
              </div>
              <div id="video-hashtags-wrap" className="field-wrapper">
                <input
                  type="text"
                  id="video-hashtags"
                  className="form-input"
                  name="video-hashtags"
                  placeholder="e.g. #dribbling, #shamgod, #ankles"
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <button
                className="save"
                id="save-video"
                onClick={this.handleUpload}
              >
                Ladda upp
              </button>
              <button className="abort" id="abort-video">
                Avbryt
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function previewVideo(e) {
  var videoName = $(".file-name");
  if (window.FileReader) {
    var file = e.target.files[0];
    var reader = new FileReader();
    if (!file) {
    } else if (file && file.type.match("video.*")) {
      reader.readAsDataURL(file);
    } else {
      videoName.text("(No file has been selected)");
    }
    reader.onloadend = function(e) {
      videoName.text(file.name);
      if ($("#video-title").val() == "") {
        $("#video-title").val(file.name);
      }
    };
  }
}

function previewThumbnail(e) {
  var img = $(".thumbnail-preview");
  if (window.FileReader) {
    var file = e.target.files[0];
    var reader = new FileReader();
    if (file && file.type.match("image.*")) {
      reader.readAsDataURL(file);
    } else {
      img.attr("src", noThumbnail);
    }
    reader.onloadend = function(e) {
      img.attr("src", reader.result);
      img.css("display", "block");
    };
  }
}

function rndStr() {
  var x = Math.random()
    .toString(36)
    .substring(7)
    .substr(0, 5);
  while (x.length != 5) {
    x = Math.random()
      .toString(36)
      .substring(7)
      .substr(0, 5);
  }
  return x;
}

export default VideoUpload;
