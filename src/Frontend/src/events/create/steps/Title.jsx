import InputField from "_components/Form/InputField";

export { Title };

function Title(props) {
  const {
    formField: { title },
  } = props;

  return (
    <div>
      <div className="mb-8">
        <InputField
          autoFocus={true}
          name={title.name}
          label={title.label}
          fullWidth
        />
      </div>
    </div>
  );
}
