export { AccountDetails };

function AccountDetails() {
  return (
    <div>
      <div className="mb-3">
        <h1 class="mb-2 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl">
          Account details
        </h1>
      </div>
      <div>
        <label className="block text-md font-medium leading-6 text-gray-900">
          Nick name
        </label>
        <div className="mt-2">
          <input
            name="username"
            type="text"
            required
            placeholder="add a healthy nick name"
            className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block text-md font-medium leading-6 text-gray-900">
          Email
        </label>
        <div className="mt-2">
          <input
            name="email"
            type="text"
            required
            placeholder="add you email"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
  );
}
