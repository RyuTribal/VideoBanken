import { makeStyles } from "@material-ui/styles";
const LinkStyles = makeStyles((theme) => ({
  root: {
    textDecoration: "underline",
  },
  noUnderLink: {
    textDecoration: "none",
    ":hover": {
      textDecoration: "none",
    },
    ":focus": {
      textDecoration: "none",
    },
  },
  actionLink: {
    color: theme.palette.secondary.dark,
  },
  inheritLink: {
    color: "inherit",
    ":hover": {
      color: "inherit",
    },
    ":focus": {
      color: "inherit",
    },
  },
  left: {
    float: "left",
  },
  right: {
    float: "right",
  },
  center: {
    margin: "0 auto",
  },
  marginBottom: {
    marginBottom: 30,
  },
  marginTop: {
    marginTop: 30,
  },
}));

export default LinkStyles;
