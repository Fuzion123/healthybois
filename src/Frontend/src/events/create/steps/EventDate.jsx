import DatePickerField from "_components/Form/DateField";

export { EventDate };

function EventDate(props) {
  const {
    formField: { startsAt, endsAt },
  } = props;

  return (
    <div>
      <div className="flex flex-col mb-8">
        <div>
          <DatePickerField name={startsAt.name} label={startsAt.label} />
        </div>
        <div className="mt-2">
          <DatePickerField name={endsAt.name} label={endsAt.label} />
        </div>
      </div>
    </div>
  );
}
