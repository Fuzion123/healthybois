export { Password };

function Password({ password, passwordConfirm, updateFields }) {
  return (
    <div>
      <h1 className="mb-3 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl">
        Stay safe
      </h1>
      <div>
        <label className="block text-md font-medium leading-6 text-gray-900">
          Password
        </label>
        <div className="mt-2">
          <input
            name="password"
            type="password"
            placeholder="at least 6 characters"
            required
            autoFocus
            value={password}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(e) => updateFields({ password: e.target.value })}
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
            placeholder="make it healthy"
            required
            value={passwordConfirm}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(e) => updateFields({ passwordConfirm: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
