import React from "react";
import { Box, Typography, Button } from "@material-ui/core";
import ButtonStyles from "../../redundant_styles/Button";
import LinkStyles from "../../redundant_styles/Link";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

function FormSubmission(props) {
  const buttonClasses = ButtonStyles();
  const linkClasses = LinkStyles();
  return (
    <Box
      style={{
        maxWidth: 510,
        margin: "0 auto",
        padding: 30,
      }}
    >
      <Typography paragraph>
        <b>Klart!</b> {`${props.text} `}
        {props.link && (
          <Link
            className={`${linkClasses.root} ${linkClasses.actionLink}`}
            to={props.linkTo}
          >
            {props.linkText}
          </Link>
        )}
      </Typography>
      {props.button && (
        <Button
          disabled={props.loading}
          type="submit"
          className={buttonClasses.submit}
          onClick={() => props.handleClick()}
        >
          {props.loading === true ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : (
            props.buttonText
          )}
        </Button>
      )}
    </Box>
  );
}
export default FormSubmission;
