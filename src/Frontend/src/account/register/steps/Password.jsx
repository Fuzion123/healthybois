export { Password };

function Password() {
  return (
    <div>
      <div>
        <label className="block text-md font-medium leading-6 text-gray-900">
          Password
        </label>
        <div className="mt-2">
          <input
            name="password"
            type="password"
            placeholder="least 6 characters"
            required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="mt-2">
        <label className="block text-md font-medium leading-6 text-gray-900">
          Confirm password
        </label>
        <div className="mt-2">
          <input
            name="password"
            type="password"
            placeholder="and make it healthy"
            required
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
  );
}
