import { Title } from "./steps/Title";
import { Description } from "./steps/Description";
import { EventDate } from "./steps/EventDate";
import { Image } from "./steps/Image";
import { Header } from "_components/Header";
import validationSchema from "./validationSchema";
import formModel from "./formModel";
import initialValues from "./initialValues";
import { imageService } from "_helpers/ImageService";
import { CircularProgress } from "@mui/material";
import { eventapi } from "_api";
import { useMultiStepForm } from "account";
import { Formik, Form } from "formik";
import Participants from "./steps/Participants";
import { history } from "_helpers";
import { useQueryClient } from "react-query";
import { userService } from "_helpers";

export { CreateEvent };

const { formId, formField } = formModel;

function CreateEvent() {
  const queryClient = useQueryClient();
  const { currentStepIndex, step, next, back, isLastStep, isFirstStep } =
    useMultiStepForm([
      <Title formField={formField} />,
      <Image formField={formField} />,
      <Participants formField={formField} />,
      <EventDate formField={formField} />,
      <Description formField={formField} />,
    ]);

  const currentValidationSchema = validationSchema[currentStepIndex];

  async function _submitForm(values, actions) {
    var response = await eventapi.create({
      title: values["title"],
      description: values["description"],
      startsAt: values["startsAt"],
      endsAt: values["endsAt"],
      picture: {
        name: values["image"].name,
        base64: await imageService.toBase64(values["image"]),
      },
      participants: values["participants"].map((p) => ({
        userId: p.userId,
      })),
    });

    actions.setSubmitting(false);

    queryClient.invalidateQueries({
      queryKey: [`/user/events/${userService.currentUser.id}`],
    });

    // clean up of image data
    // without this, if creating another event, the old event image will show again.
    formModel.formField.image.url = "";
    formModel.formField.image.file = null;

    history.navigate(`/events/${response.id}`);
  }

  async function _handleSubmit(values, actions) {
    if (isLastStep) {
      await _submitForm(values, actions);
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
    <div className="flex flex-col justify-center sm:mx-auto sm:w-full sm:max-w-lg mt-2 mb-2">
      <div className="mb-4">
        <Header
          title={"Create Event"}
          overwriteClickHandler={!isFirstStep ? _handleBack : undefined}
        />
      </div>
      <div>
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
                    {isSubmitting ? (
                      <CircularProgress size={24} />
                    ) : isLastStep ? (
                      "Create event"
                    ) : (
                      "Next"
                    )}
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
