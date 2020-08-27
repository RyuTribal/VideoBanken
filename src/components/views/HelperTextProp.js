import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner } from "@fortawesome/free-solid-svg-icons";
import LinkStyles from "../../redundant_styles/Link";
function HelperTextProp(props) {
  const linkClasses = LinkStyles();
  return (
    <Typography paragraph>
      {`Koden bör komma till er email inom kort ifall användaren existerar i
        databasen och email addressen är verifierad. Håll koll på er spam folder
        ifall mejlet inte dyker upp eller `}
      <Link
        className={`${linkClasses.root} ${linkClasses.actionLink}`}
        onClick={props.resend}
      >
        tryck här för att skicka koden igen
      </Link>{" "}
      {props.loadingResend === true && (
        <FontAwesomeIcon style={{ color: "#b1aca3" }} icon={faSpinner} spin />
      )}
      {props.loadingResendDone === true && (
        <FontAwesomeIcon style={{ color: "#7b8c49" }} icon={faCheck} />
      )}
    </Typography>
  );
}

export default HelperTextProp;
