import React from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Typography,
  Step,
  StepLabel,
  Button,
  Stepper,
  DialogContentText,
} from "@material-ui/core";
import isMobile from "../../../redundant_functions/isMobile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
const styles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  stepContent: {
    paddingBottom: 30,
    display: "flex",
    justifyContent: "center",
  },
}));
export default function StepperComponent(props) {
  const classes = styles();
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [loading, setLoading] = React.useState(false);
  const isStepOptional = (step) => {
    return props.steps[step].optional;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = async (step) => {
    let newSkipped = skipped;
    setLoading(true);
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }
    const complete = await props.handleNext(activeStep);
    if (complete) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
    setLoading(false);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };
  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep}>
        {props.children.map((step, i) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(i)) {
            labelProps.optional = (
              <Typography variant="caption">
                {props.steps[i].optionalText
                  ? props.steps[i].optionalText
                  : "Valfritt"}
              </Typography>
            );
          }
          if (isStepSkipped(i)) {
            stepProps.completed = false;
          }
          return (
            <Step key={props.steps[i].label} {...stepProps}>
              <StepLabel {...labelProps}>
                {!isMobile() && props.steps[i].label}
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {activeStep === props.children.length ? (
          <div>
            <Typography className={classes.instructions}>
              Alla steg är avslutade, du är klar!
            </Typography>
            <Button onClick={props.onClose} className={classes.button}>
              Stäng
            </Button>
          </div>
        ) : (
          <div>
            <DialogContentText>
              {props.steps[activeStep].helperText}
            </DialogContentText>
            <div className={classes.stepContent}>
              {props.children[activeStep]}
            </div>

            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                {!loading ? "Backa" : <FontAwesomeIcon icon={faSpinner} spin />}
              </Button>
              {isStepOptional(activeStep) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSkip}
                  className={classes.button}
                >
                  {!loading ? (
                    "Skippa"
                  ) : (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  )}
                </Button>
              )}

              <Button
                variant="contained"
                color="primary"
                onClick={() => handleNext()}
                className={classes.button}
              >
                {!loading ? (
                  activeStep === props.children.length - 1 ? (
                    "Avsluta"
                  ) : (
                    "Nästa"
                  )
                ) : (
                  <FontAwesomeIcon icon={faSpinner} spin />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
