import { createMuiTheme } from "@material-ui/core/styles";
const theme = createMuiTheme({
  palette: {
    type: "light",
    primary: {
      main: "#263040",
      light: "#4f596b",
      dark: "#1e2633",
    },
    secondary: {
      main: "#ea3a3a",
      light: "#ff7165",
      dark: "#b00013",
      disabled: "rgb(245, 244, 242)",
    },
    text: {
      // primary: "#263040",
      secondary: "rgba(0, 0, 0, 0.54)",
    },
    background: {
      default: "#fbf9f9",
    },
  },
});
export default theme;
