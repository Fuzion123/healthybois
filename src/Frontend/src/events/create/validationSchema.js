import * as Yup from "yup";
import formModel from "./formModel";
import dayjs from "dayjs";

const {
  formField: { title, description, startsAt, endsAt, image, participants },
} = formModel;

const exportObject = [
  Yup.object().shape({
    [title.name]: Yup.string().required(`${title.requiredErrorMsg}`),
  }),
  Yup.object().shape({
    [image.name]: Yup.mixed()
      .required("Event picture is required")
      .test("fileSize", "Event picture is too large", (value) => {
        return value && value && value.size <= 10000000; // maximum file size of 10 MB
      })
      .test("fileType", "Unsupported file format", (value) => {
        return (
          value && value && ["image/jpeg", "image/png"].includes(value.type)
        );
      }),
  }),
  Yup.object().shape({
    [participants.name]: Yup.array(),
  }),
  Yup.object().shape({
    [startsAt.name]: Yup.date()
      .required(`${endsAt.requiredErrorMsg}`)
      .min(dayjs(new Date()), "Date is too early"),
    [endsAt.name]: Yup.date()
      .required(`${endsAt.requiredErrorMsg}`)
      .min(Yup.ref("startsAt"), "End date can't be before start date"),
  }),
  Yup.object().shape({
    [description.name]: Yup.string(),
  }),
];

export default exportObject;
