import { Title } from "./steps/Title";
import { Description } from "./steps/Description";
import { EventDate } from "./steps/EventDate";
import { Image } from "./steps/Image";
import { Header } from "_components/Header";
import validationSchema from "./validationSchema";
import formModel from "./formModel";
import initialValues from "./initialValues";

import { CircularProgress } from "@mui/material";

import { useMultiStepForm } from "account";
import { Formik, Form } from "formik";

const { formId, formField } = formModel;

export { CreateEvent };

function CreateEvent() {
  const { currentStepIndex, step, next, back, isLastStep, isFirstStep } =
    useMultiStepForm([
      <Title formField={formField} />,
      <Description formField={formField} />,
      <EventDate formField={formField} />,
      <Image formField={formField} />,
    ]);

  const currentValidationSchema = validationSchema[currentStepIndex];

  function _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function _submitForm(values, actions) {
    await _sleep(1000);
    alert(JSON.stringify(values, null, 2));
    actions.setSubmitting(false);

    next();
  }

  function _handleSubmit(values, actions) {
    if (isLastStep) {
      _submitForm(values, actions);
    } else {
      next();
      actions.setTouched({});
      actions.setSubmitting(false);
    }
  }

  function _handleBack() {
    back();
  }

  return (
    <div>
      <div>
        <Header
          title={"Create Event"}
          overwriteClickHandler={!isFirstStep ? _handleBack : undefined}
        />
      </div>
      <div className="mt-8 mb-8">
        <Formik
          initialValues={initialValues}
          validationSchema={currentValidationSchema}
          onSubmit={_handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form id={formId}>
              {step}
              <div>
                <div>
                  <button
                    className="btn-primary w-full"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isLastStep ? "Create event" : "Next"}
                    {isSubmitting && <CircularProgress size={24} />}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
