import React, { Component } from "react";
import { StyleSheet, css } from "aphrodite";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import { Auth, API, graphqlOperation, Storage } from "aws-amplify";
import * as queries from "../../../graphql/queries";
import * as mutations from "../../../graphql/mutations";

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    position: "relative",
    display: "flex",
    justifyContent: "center",
  },
  coverPhoto: {
    height: "100%",
    width: "100%",
    position: "relative",
    display: "flex",
    cursor: "pointer",
  },
  None: {
    backgroundColor: "#263040",
  },
  changeCover: {
    position: "absolute",
    background: "#fbf9f9",
    width: 35,
    height: 35,
    bottom: "5%",
    right: "3%",
    borderRadius: 5,
    color: "#263040",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    cursor: "pointer",
  },
  profileImageContainer: {
    flex: "2",
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  equalizer: {
    flex: "5",
    display: "flex",
    width: "100%",
    "@media (max-width: 813px)": {
      display: "none",
    },
    "@media (max-width: 1025px) and (orientation: landscape)": {
      display: "none",
    },
  },
});

class CoverPhoto extends Component {
  constructor() {
    super();
    this.state = {
      coverPhoto: null,
      currentUser: false,
      user: "",
      loading: false,
    };
  }
  imageDropRef = React.createRef();
  componentDidMount = async () => {
    const currentUser = await Auth.currentAuthenticatedUser();
    console.log(currentUser.username);
    console.log(this.props.user);
    this.setState({
      user: this.props.user,
    });
    if (this.props.user === currentUser.username) {
      this.setState({
        currentUser: true,
        user: this.props.user,
      });
    }
    this.getCoverPhoto();
  };
  componentDidUpdate = async (prevProps) => {
    if (prevProps.user !== this.props.user) {
      this.componentDidMount();
    }
  };
  handleImageUpload = async (e) => {
    this.setState({ loading: true });
    await Storage.vault.put(`coverPhoto.jpg`, e.target.files[0], {
      bucket: "user-images-hermes",
      level: "public",
      customPrefix: {
        public: `${this.state.user}/`,
      },
      progressCallback(progress) {
        console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
      },
    });
    await API.graphql(
      graphqlOperation(mutations.editUser, {
        input: {
          username: this.state.user,
          coverImg: `coverPhoto.jpg`,
        },
      })
    );
    await this.getCoverPhoto();
    this.setState({ loading: false });
  };
  getCoverPhoto = async () => {
    await Storage.vault
      .get(`coverPhoto.jpg`, {
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
        this.setState({ coverPhoto: res });
      });
  };
  changeCover = async () => {};
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
          onChange={this.handleImageUpload}
        ></input>
        {this.state.coverPhoto === null ? (
          <div className={css(styles.coverPhoto, styles.None)}>
            <div className={css(styles.profileImageContainer)}>
              <ProfileImage user={this.state.user} />
            </div>
            <div className={css(styles.equalizer)}></div>
          </div>
        ) : (
          <div
            style={{
              backgroundImage: `url(${this.state.coverPhoto})`,
              backgroundSize: "cover",
            }}
            className={css(styles.coverPhoto, styles.None)}
          >
            <div className={css(styles.profileImageContainer)}>
              <ProfileImage
                changeProfile={(profileImg, fullName) =>
                  this.props.changeProfile(profileImg, fullName)
                }
                user={this.state.user}
              />
            </div>
            <div className={css(styles.equalizer)}></div>
          </div>
        )}
        {this.state.currentUser === true && (
          <div
            onClick={() => {
              this.refs.imageUploader.click();
            }}
            className={css(styles.changeCover)}
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

export default CoverPhoto;
