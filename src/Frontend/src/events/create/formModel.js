const formModel = {
  formId: "eventCreationForm",
  formField: {
    title: {
      name: "title",
      label: "title",
      requiredErrorMsg: "Title is required",
    },
    description: {
      name: "description",
      label: "description (optional)",
    },
    startsAt: {
      name: "startsAt",
      label: "Event starts on",
      requiredErrorMsg: "Start date is required",
    },
    endsAt: {
      name: "endsAt",
      label: "Event ends on",
      requiredErrorMsg: "End date is required",
    },
  },
};

export default formModel;
