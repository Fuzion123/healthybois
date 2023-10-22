import InputFieldTextArea from "_components/Form/InputFieldTextArea";

export { Description };

function Description(props) {
  const {
    formField: { description },
  } = props;

  return (
    <div>
      <div className="mb-8">
        <InputFieldTextArea
          autoFocus={true}
          name={description.name}
          label={description.label}
          fullWidth
        />
      </div>
    </div>
  );
}
