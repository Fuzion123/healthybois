import formModel from "./formModel";

const {
  formField: { title, description, startsAt, endsAt },
} = formModel;

const exportModel = {
  [title.name]: "",
  [description.name]: "",
  [startsAt.name]: "",
  [endsAt.name]: "",
};

export default exportModel;
