export { Email };

function Email() {
  return (
    <div>
      <label className="block text-md font-medium leading-6 text-gray-900">
        Email
      </label>
      <div className="mt-2">
        <input
          name="email"
          type="text"
          required
          placeholder="veryhealthy@gmail.com"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
}
