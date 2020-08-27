import React from "react";
import { Button, Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import ButtonStyles from "../../redundant_styles/Button";
import LinkStyles from "../../redundant_styles/Link";
const styles = makeStyles((theme) => ({
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  formWrapper: {
    width: 550,
  },
  formContainerCenter: {
    maxWidth: 510,
    display: "block",
    margin: "0 auto",
  },
  formContainerBorder: {
    borderRadius: 5,
    padding: 30,
    border: "1px solid #999999",
  },
  uniError: {
    color: theme.palette.error.main,
    textAlign: "center",
    transition: "0.4s",
    paddingBottom: 20,
  },
  header: {
    margin: "20px 0",
    textAlign: "center",
    fontWeight: "bold",
  },
  appbar: {
    backgroundColor: "#263040",
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  separator: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    color: "#bf9c96",
    marginTop: 30,
    marginBottom: 30,

    "&::before": {
      content: '""',
      flex: 1,
      borderBottom: "1px solid #bf9c96",
      marginRight: "0.25em",
    },
    "&::after": {
      content: '""',
      flex: 1,
      borderBottom: "1px solid #bf9c96",
      marginLeft: "0.25em",
    },
  },
  socialWrapper: {
    display: "flex",
    alignItems: "center",
  },
  formLink: {
    textAlign: "center",
    padding: "20px 0",
  },
}));
function renderSocialButtons(props, buttonClasses, classes) {
  return (
    <Box>
      {props.federatedButtons &&
        (props.federatedButtonsPos === "bottom" ||
          !props.federatedButtonsPos) && (
          <div className={classes.separator}>eller</div>
        )}
      <Button
        disabled={props.loading}
        fullWidth={props.buttonFullWidth}
        onClick={() => props.submit("google")}
        className={buttonClasses.socialBtn}
      >
        <div className={classes.socialWrapper}>
          <img
            alt="Google's logo"
            style={{ marginRight: "0.25em" }}
            src="//d35aaqx5ub95lt.cloudfront.net/images/google-color.svg"
          ></img>
          <span className={buttonClasses.googleBtn}>Google</span>
        </div>
      </Button>
      <Button
        disabled={props.loading}
        fullWidth={props.buttonFullWidth}
        onClick={() => props.submit("fb")}
        className={buttonClasses.socialBtn}
      >
        <div className={classes.socialWrapper}>
          <img
            alt="Facebooks's logo"
            style={{ marginRight: "0.25em" }}
            src="//d35aaqx5ub95lt.cloudfront.net/images/facebook-blue.svg"
          ></img>
          <span className={buttonClasses.fbBtn}>Facebook</span>
        </div>
      </Button>
      {props.federatedButtons && props.federatedButtonsPos === "top" && (
        <div className={classes.separator}>eller</div>
      )}
    </Box>
  );
}

function Form(props) {
  const classes = styles();
  const buttonClasses = ButtonStyles();
  const linkClasses = LinkStyles();
  return (
    <div className={classes.container}>
      <Box className={classes.formWrapper}>
        {props.header && (
          <Typography className={classes.header} variant="h5" component="h1">
            {props.headerValue}
          </Typography>
        )}
        <Box
          className={`${props.border && classes.formContainerBorder}
             ${props.position === "center" && classes.formContainerCenter}`}
        >
          {props.federatedButtons && props.federatedButtonsPos === "top"
            ? renderSocialButtons(props, buttonClasses, classes)
            : ""}
          {props.helperTextProp && props.helperTextProp}
          {props.uniError && (
            <Typography className={classes.uniError}>
              {props.uniErrorMessage}
            </Typography>
          )}
          {props.children}
          {props.forgotPassword && (
            <Link
              className={`${linkClasses.root} ${linkClasses.actionLink} ${linkClasses.right} ${linkClasses.marginBottom}`}
              to="password-reset"
            >
              Glömt lösenordet?
            </Link>
          )}
          {props.buttons && (
            <Button
              className={props.buttonPrimary && buttonClasses.submit}
              disabled={props.buttonDisabled || props.loading}
              type="submit"
              fullWidth={props.buttonFullWidth}
              onClick={() => props.submit("cognito")}
            >
              {props.loading === true ? (
                <FontAwesomeIcon icon={faSpinner} spin />
              ) : (
                props.buttonValue
              )}
            </Button>
          )}
          {props.federatedButtons &&
          (props.federatedButtonsPos === "bottom" || !props.federatedButtonsPos)
            ? renderSocialButtons(props, buttonClasses, classes)
            : ""}
        </Box>
        {props.type === "login" || props.type === "registration" ? (
          <Box className={classes.formLink}>
            {`${props.linkText} `}
            <Link
              className={`${linkClasses.root} ${linkClasses.actionLink}`}
              to={props.link}
            >
              {props.linkValue}
            </Link>
          </Box>
        ) : (
          ""
        )}
      </Box>
    </div>
  );
}

export default Form;
