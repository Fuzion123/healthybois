import formModel from "./formModel";
import dayjs from "dayjs";

function addHours(date, h) {
  date.setHours(date.getHours() + h);
  return date;
}

const {
  formField: { title, description, startsAt, endsAt, participants, image },
} = formModel;

const exportModel = {
  [title.name]: "",
  [description.name]: "",
  [startsAt.name]: dayjs(new Date()),
  [endsAt.name]: dayjs(addHours(new Date(), 1)),
  [participants.name]: [],
  [image.name]: "",
};

export default exportModel;
