import { makeStyles } from "@material-ui/styles";
const ButtonStyles = makeStyles((theme) => ({
  submit: {
    background: theme.palette.secondary.main,
    padding: "10px 20px",
    boxSizing: "border-box",
    fontSize: 15,
    border: 0,
    marginTop: 20,
    width: "100%",
    borderRadius: 5,
    color: "#fbf9f9",
    transition: "background-color 0.4s",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.secondary.dark,
      transition: "0.4s",
    },
    "&:focus": {
      outline: "none",
    },
    "&:disabled": {
      backgroundColor: theme.palette.secondary.disabled,
    },
  },
  socialBtn: {
    textAlign: "center",
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 15,
    fontWeight: "bold",
    borderRadius: 10,
    textDecoration: "none",
    background: "#fbf9f9",
    cursor: "pointer",
    marginTop: 30,
    border: "2px solid #bf9c96",
  },
  googleBtn: {
    color: "#4285f4",
  },
  fbBtn: {
    color: "#3b5998",
  },
}));

export default ButtonStyles;
