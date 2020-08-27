import React, { Component } from "react";
import Modal from "./views/Modal";
import validate from "../redundant_functions/validate";
import Stepper from "./views/view_components/Stepper";
import Form from "./views/Form";
import Input from "./views/view_components/Input";
import Avatar from "react-avatar-edit";
import generateMarks from "../redundant_functions/generateMarks";
import { connect } from "react-redux";
import hermesAPI from "../graphql";
import * as mutations from "../graphql/mutations";
import { Storage } from "aws-amplify";
import { set_user, set_profile_img } from "../redux/actions";
import dataURItoBlob from "../redundant_functions/dataURIToBlob";
const heightMarks = generateMarks(115, 235, 15, "cm");
const weightMarks = generateMarks(0, 160, 20, "kg");
function mapStateToProps(state) {
  return { user: state.user };
}
function mapDispatchToProps(dispatch) {
  return {
    set_user: (user) => dispatch(set_user(user)),
    set_profile_img: (img) => dispatch(set_profile_img(img)),
  };
}
class NoUserModal extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      name: "",
      desc: "",
      height: null,
      weight: null,
      usernameError: false,
      usernameErrorMessage: "Detta fält kan inte vara tomt",
      nameError: false,
      nameErrorMessage: "Detta fält kan inte vara tomt",
      descError: false,
      descErrorMessage: "Detta fält kan inte vara tomt",
      touched: {
        username: false,
        name: false,
        desc: false,
      },
    };
  }
  componentDidMount = () => {
    this.setState({
      username: this.props.user.username,
      name: this.props.user.fullName,
    });
  };
  shouldMarkError = (field, fields) => {
    const hasError = validate(fields)[field];
    const shouldShow = this.state.touched[field];
    return hasError ? shouldShow : false;
  };
  handleSubmit = async (step) => {
    switch (step) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        break;
      default:
        console.log("That is not a step");
    }
  };
  handleUpload = async (step) => {
      let response = "";
    switch (step) {
      case 0:
        response = await hermesAPI(
          "mutate",
          "mutation",
          mutations.editUser,
          {
            id: this.props.user.id,
            username: this.state.username,
          }
        )
          .then((res) => {
            this.props.set_user(res.data.editUser);
            return true;
          })
          .catch((err) => {
            this.setState({
              usernameError: true,
              usernameErrorMessage: "Detta användarnamn är redan upptaget",
            });
            return false;
          });
        return response;
      case 1:
        response = await Storage.vault
          .put(`profilePhoto.jpg`, dataURItoBlob(this.state.image), {
            bucket: "user-images-hermes",
            level: "public",
            customPrefix: {
              public: `${this.props.user.id}/`,
            },
          })
          .then((res) => {
            this.props.set_profile_img(res);
            return true;
          })
          .catch(() => {
            return false;
          });
        return response;
      case 2:
        response = await hermesAPI(
          "mutate",
          "mutation",
          mutations.editUser,
          {
            id: this.props.user.id,
            fullName: this.state.name,
            description: this.state.desc,
            height: this.state.height,
            weight: this.state.weight,
          }
        )
          .then((res) => {
            this.props.set_user(res.data.editUser);
            return true;
          })
          .catch(() => {
            return false;
          });
        return true;
      default:
        return false;
    }
  };
  render() {
    console.log(this.props);
    const stepInfo = [
      {
        optional: false,
        label: "Välj ett användarnamn",
        helperText: `Ett användarnamn har genererats åt dig, du kan välja att behålla
          det eller välja ett eget. Med detta namn kommer andra användare
          kunna hänsiva till och söka efter din profil.`,
      },
      {
        label: "Lägg upp profil bild",
        optional: true,
        optionalText: "Valfritt",
        helperText: `Lägg upp en foto av dig för att stå ut från andra.`,
      },
      {
        label: "Fyll i profil information",
        optional: false,
        helperText: `Fyll i information om dig själv och låt andra veta vem du är och
        hur de jämförs med dig`,
      },
    ];
    return (
      <Modal
        onClose={this.props.onClose}
        closeButton={true}
        onlyMobileClose={true}
        closeValue="Stäng"
        title="Gör klart din profil"
      >
        <Stepper
          onClose={this.props.onClose}
          handleNext={(step) => this.handleUpload(step)}
          steps={stepInfo}
        >
          <Form>
            <Input
              id="username"
              type="text"
              label="Användarnamn"
              error={
                this.state.usernameError ||
                this.shouldMarkError("username", [
                  { id: "username", value: this.state.username },
                ])
              }
              errorText={this.state.usernameErrorMessage}
              required
              value={this.state.username}
              onChange={(value) => this.setState({ username: value })}
              onBlur={() =>
                this.setState({
                  touched: { ...this.state.touched, username: true },
                })
              }
            />
          </Form>
          <Avatar
            label="Välj en fil"
            width={390}
            height={295}
            onCrop={(img) => this.setState({ image: img })}
            onClose={() => this.setState({ image: null })}
          />
          <Form>
            <Input
              id="name"
              type="text"
              label="Namn"
              error={
                this.state.nameError ||
                this.shouldMarkError("name", [
                  { id: "name", value: this.state.name },
                ])
              }
              errorText={this.state.nameErrorMessage}
              required
              value={this.state.name}
              onChange={(value) => this.setState({ name: value })}
              onBlur={() =>
                this.setState({
                  touched: { ...this.state.touched, name: true },
                })
              }
            />
            <Input
              id="desc"
              type="textarea"
              label="Beskrivning"
              error={this.state.descError}
              errorText={this.state.descErrorMessage}
              value={this.state.desc}
              onChange={(value) => this.setState({ desc: value })}
            />
            <Input
              id="height"
              type="slider"
              label="Längd"
              value={this.state.height}
              onChange={(value) => this.setState({ height: value })}
              marks={heightMarks}
              suffix="cm"
              min={heightMarks[0].value}
              max={heightMarks[heightMarks.length - 1].value}
            />
            <Input
              id="weight"
              type="slider"
              label="Vikt"
              value={this.state.weight}
              onChange={(value) => this.setState({ weight: value })}
              marks={weightMarks}
              suffix="kg"
              min={weightMarks[0].value}
              max={weightMarks[weightMarks.length - 1].value}
            />
          </Form>
        </Stepper>
      </Modal>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(NoUserModal);
