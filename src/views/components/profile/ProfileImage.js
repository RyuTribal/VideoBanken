import React, { Component } from "react";
import { StyleSheet, css } from "aphrodite";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import blankProfile from "../../../img/blank-profile.png";
import { Auth, API, graphqlOperation, Storage } from "aws-amplify";
import * as queries from "../../../graphql/queries";
import * as mutations from "../../../graphql/mutations";
import Modal from "./Modal";

const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 200,
    position: "relative",
    cursor: "pointer",
    padding: 20,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
  },
  changeImage: {
    position: "absolute",
    background: "#fbf9f9",
    width: 35,
    height: 35,
    bottom: "11%",
    right: "17%",
    borderRadius: "50%",
    color: "#263040",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    cursor: "pointer",
  },
});

class ProfileImage extends Component {
  constructor() {
    super();
    this.state = {
      profileImage: null,
      currentUser: false,
      user: "",
      loading: false,
      modal: false,
      image: "",
    };
  }
  imageDropRef = React.createRef();
  componentDidMount = async () => {
    const currentUser = await Auth.currentAuthenticatedUser();
    console.log(currentUser.username);
    console.log(this.props.user);
    if (this.props.user === currentUser.username) {
      this.setState({
        currentUser: true,
        user: this.props.user,
      });
    }
    this.getProfilePhoto();
  };
  componentDidUpdate = async (prevProps) => {
    if (prevProps.user !== this.props.user) {
      this.componentDidMount();
    }
  };
  getProfilePhoto = async () => {
    await Storage.vault
      .get(`profilePhoto.jpg`, {
        bucket: "user-images-hermes",
        level: "public",
        customPrefix: {
          public: `${this.state.user}/`,
        },
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
      })
      .then((res) => {
        this.setState({ profileImage: res });
      });
  };
  handleImageUpload = async (image) => {
    this.setState({ loading: true });
    let imgUrl = await Storage.vault
      .put(`profilePhoto.jpg`, image, {
        bucket: "user-images-hermes",
        level: "public",
        customPrefix: {
          public: `${this.state.user}/`,
        },
        progressCallback(progress) {
          console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
        },
      })
      .then((res) => {
        return res;
      });
    await API.graphql(
      graphqlOperation(mutations.editUser, {
        input: {
          username: this.state.user,
          profileImg: `profilePhoto.jpg`,
        },
      })
    );
    await this.getProfilePhoto();
    this.props.changeProfile(imgUrl, null);
    this.setState({ loading: false });
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
    return (
      <div className={css(styles.container)}>
        <input
          id="image-uploader"
          type="file"
          className="upload"
          accept="image/*"
          style={{ display: "none" }}
          ref="imageUploader"
          onChange={(e) =>
            this.setState({ modal: true, image: e.target.files[0] })
          }
        ></input>
        {this.state.modal && (
          <Modal
            image={this.state.image}
            closeModal={() => {
              this.setState({ modal: false });
              this.refs.imageUploader.value = "";
            }}
            upload={(image) => {
              this.setState({ modal: false });
              this.refs.imageUploader.value = "";
              this.handleImageUpload(this.dataURItoBlob(image));
            }}
          />
        )}

        <img
          onError={() => this.setState({ profileImage: blankProfile })}
          src={this.state.profileImage}
          className={css(styles.profileImage)}
        ></img>
        {this.state.currentUser === true && (
          <div
            onClick={() => {
              this.refs.imageUploader.click();
            }}
            className={css(styles.changeImage)}
          >
            {this.state.loading ? (
              <i class="fas fa-sync fa-spin"></i>
            ) : (
              <i className="fas fa-camera"></i>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default ProfileImage;
