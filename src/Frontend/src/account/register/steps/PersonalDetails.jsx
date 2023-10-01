export { PersonalDetails };

function PersonalDetails() {
  return (
    <div>
      <div className="mb-4">
        <h1 class="mb-2 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl">
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
            type="text"
            required
            placeholder="enter you first name"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
            type="text"
            placeholder="enter you last name"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
  );
}
