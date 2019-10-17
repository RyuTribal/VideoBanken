import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import noThumbnail from "../img/no-thumbnail.jpg";
import $ from "jquery";
import Amplify from "aws-amplify";
import { Auth, Hub, Storage } from "aws-amplify";
import awsconfig from "../aws-exports";

class VideoUpload extends Component {
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

  handleUppload(){
    var nameOfFile = $('')
    Storage.put('test.txt', 'Hello')
    .then (result => console.log(result)) // {key: "test.txt"}
    .catch(err => console.log(err));
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
              <div className="field-wrapper">
                <input
                  type="text"
                  id="video-hashtags"
                  className="form-input"
                  name="video-hashtags"
                  placeholder="e.g. #dribbling, #shamgod, #ankles"
                />
              </div>
              <div className="error error-msg-pass">
                <p></p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <button className="save" id="save-video" onClick={this.handleUppload}>
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

export default VideoUpload;
