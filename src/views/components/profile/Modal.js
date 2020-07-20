import React, { Component } from "react";
import { StyleSheet, css } from "aphrodite";
import Avatar from "react-avatar-edit";

const styles = StyleSheet.create({
  container: {
    position: "fixed",
    height: "100%",
    width: "100%",
    background: "rgba(0,0,0,0.7)",
    "z-index": "90000",
    top: 0,
    left: 0,
  },
  modal: {
    height: "100%",
    position: "relative",
    margin: "0 auto",
    padding: "1.5em",
    "-webkit-overflow-scrolling": "touch",
    "@media (min-width: 60em)": {
      height: "75%",
      margin: "5% auto",
      maxHeight: "57em",
      maxWidth: "66em",
      width: "85%",
    },
    backgroundColor: "#F7F8FC",
    "z-index": "90001",
  },
  modalHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    "@media (max-width: 601px)": {
      fontSize: 13,
    },
    "@media (max-width: 376px)": {
      fontSize: 11,
    },
    paddingBottom: 20,
  },
  header: {
    flex: 4,
    textAlign: "center",
  },
  buttonContainer: {
    flex: 1,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  submitButton: {
    background: "#ea3a3a",
    padding: "10px 20px",
    fontSize: "1.5em",
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
  closeModal: {
    flex: 1,
    cursor: "pointer",
  },
  avatarWrapper: {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
});

class Modal extends Component {
  constructor() {
    super();
    this.state = { image: null };
    this.onCrop = this.onCrop.bind(this);
    this.onClose = this.onClose.bind(this);
  }
  onCrop(preview) {
    this.setState({ image: preview });
  }
  onClose() {
    this.setState({ image: null });
  }
  render() {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.modal)}>
          <div className={css(styles.modalHeader)}>
            <h2
              onClick={() => this.props.closeModal()}
              className={css(styles.closeModal)}
            >
              <i className="fas fa-times"></i>
            </h2>
            <h2 className={css(styles.header)}>Redigera bilden</h2>
            <div className={css(styles.buttonContainer)}>
              <button
                onClick={() => {
                  if (this.state.image !== null) {
                    this.props.upload(this.state.image);
                  }
                }}
                className={css(styles.submitButton)}
                disabled={this.state.loading || this.state.image === null}
              >
                {this.state.loading === true ? (
                  <i class="fas fa-sync fa-spin"></i>
                ) : (
                  "Klar"
                )}
              </button>
            </div>
          </div>
          <div className={css(styles.avatarWrapper)}>
            <Avatar
              className={css(styles.avatarWrapper)}
              label="Välj en fil"
              width={390}
              height={295}
              onCrop={this.onCrop}
              onClose={this.onClose}
              src={URL.createObjectURL(this.props.image)}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
