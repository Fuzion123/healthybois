export { FormStepError };

function FormStepError({ error }) {
  if (!error) return <></>;

  return (
    <div className="mt-2 rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset bg-amber-100">
      <div className="flex pl-3 pr-3">{error}</div>
    </div>
  );
}
