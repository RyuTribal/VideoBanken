import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import {
  TextField,
  IconButton,
  InputAdornment,
  Slider,
} from "@material-ui/core";
const CustomTextField = withStyles({
  root: {
    "& input": {
      fontSize: 15,
      borderColor: "#a18e78",
      backgroundColor: "rgb(245, 244, 242)",
    },
    "& .MuiInputBase-multiline": {
      fontSize: 15,
      borderColor: "#a18e78",
      backgroundColor: "rgb(245, 244, 242)",
    },
    "& input:valid:focus": {
      backgroundColor: "transparent !important",
    },
    "& .Mui-focused": {
      backgroundColor: "transparent !important",
    },
    "& .MuiOutlinedInput-adornedEnd": {
      background: "rgb(245, 244, 242)",
    },
  },
})(TextField);
const CustomSlider = withStyles({
  thumb: {
    backgroundColor: "rgb(38, 48, 64)",
  },
  active: {},
  valueLabel: {
    "& *": {
      background: "rgb(38, 48, 64)",
    },
  },
  rail: {
    backgroundColor: "rgb(38, 48, 64)",
  },
  mark: {
    backgroundColor: "#bfbfbf",
    height: 8,
    width: 1,
    marginTop: -3,
  },
  markActive: {
    opacity: 1,
    backgroundColor: "rgb(38, 48, 64)",
  },
  markLabel: {
    fontSize: 8,
  },
})(Slider);
const styles = makeStyles((theme) => ({
  input: {
    width: "100%",
    marginTop: 30,
    "&:first-of-type": {
      margin: 0,
    },
  },
}));
function renderPasswordVisibility(toggle, togglePassword) {
  return (
    <InputAdornment style={{ background: "transparent" }} position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={() => togglePassword()}
      >
        {!toggle ? <Visibility /> : <VisibilityOff />}
      </IconButton>
    </InputAdornment>
  );
}
export default function Input(props) {
  const classes = styles();
  const [toggle, setToggle] = React.useState(false);
  switch (props.type) {
    case "slider":
      return (
        <div className={classes.input}>
          <label htmlFor={props.id}>{props.label}</label>
          <CustomSlider
            id={props.id}
            value={props.value}
            label={props.label}
            getAriaValueText={() => {
              return props.suffix;
            }}
            aria-labelledby="discrete-slider-always"
            step={1}
            marks={props.marks}
            min={props.min ? props.min : 0}
            max={props.max ? props.max : 100}
            valueLabelDisplay="auto"
            onChange={(e, value) => {
              props.onChange(value, props.error);
            }}
          />
        </div>
      );
    default:
      return (
        <CustomTextField
          id={props.id}
          className={classes.input}
          label={props.label}
          type={props.type === "password" && toggle ? "text" : props.type}
          multiline={props.type === "textarea"}
          rows={6}
          fullWidth={true}
          variant={props.variant ? props.vairant : "outlined"}
          onKeyDown={(e) => {
            try {
              props.checkForEnter(e.keyCode);
            } catch {}
          }}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value, props.error)}
          onBlur={() => {
            try {
              props.onBlur();
            } catch {}
          }}
          error={props.error}
          helperText={props.error ? props.errorText : ""}
          InputProps={{
            style: { fontSize: 15 },
            endAdornment:
              props.passwordVisibilityToggle && props.id === "password"
                ? renderPasswordVisibility(toggle, () => setToggle(!toggle))
                : "",
          }}
          InputLabelProps={{
            style: { fontSize: 15 },
            required: props.required,
          }}
        />
      );
  }
}
