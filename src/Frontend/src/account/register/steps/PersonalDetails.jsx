export { PersonalDetails };

function PersonalDetails({ firstName, lastName, updateFields }) {
  return (
    <div>
      <div className="mb-4">
        <h1 className="mb-2 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl">
          Your information
        </h1>
      </div>
      <div>
        <label className="block text-md font-medium leading-6 text-gray-900">
          First Name
        </label>
        <div className="mt-2">
          <input
            name="firstName"
            value={firstName}
            autoFocus
            type="text"
            required
            placeholder="add first name"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(e) => updateFields({ firstName: e.target.value })}
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-md font-medium leading-6 text-gray-900">
          Last Name
        </label>
        <div className="mt-2">
          <input
            name="lastName"
            value={lastName}
            type="text"
            required
            placeholder="add last name"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(e) => updateFields({ lastName: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
