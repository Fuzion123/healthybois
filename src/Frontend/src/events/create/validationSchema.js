import * as Yup from "yup";
import formModel from "./formModel";

const {
  formField: { title, description, startsAt, endsAt },
} = formModel;

const exportObject = [
  Yup.object().shape({
    [title.name]: Yup.string().required(`${title.requiredErrorMsg}`),
  }),
  Yup.object().shape({
    [description.name]: Yup.string(),
  }),
  Yup.object().shape({
    [startsAt.name]: Yup.date()
      .required(`${endsAt.requiredErrorMsg}`)
      .min(new Date().toISOString(), "Date is too early"),
    [endsAt.name]: Yup.date()
      .required(`${endsAt.requiredErrorMsg}`)
      .min(Yup.ref("startsAt"), "End date can't be before start date"),
  }),
];

export default exportObject;
