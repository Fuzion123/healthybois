import { useQuery } from "react-query";
import { userapi } from "_api";
import { useDispatch } from "react-redux";
import { alertActions } from "_store";

export { Email };

function Email({ email, updateFields, hasErrors }) {
  const dispatch = useDispatch();

  useQuery(
    `user/exists/${email}`,
    async () => {
      if (email === "") {
        return false;
      }

      return await userapi.exists({ userName: null, email });
    },
    {
      onSuccess: (exists) => {
        if (exists) {
          dispatch(alertActions.error(`user name or email already taken`));

          hasErrors = true;

          return;
        }

        dispatch(alertActions.clear());
        hasErrors = false;
      },
    }
  );

  return (
    <div>
      <div className="mb-1">
        <h1 className="mb-2 text-1xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl">
          Account details
        </h1>
      </div>
      <div className="">
        <label className="block text-md font-medium leading-6 text-gray-900">
          Email
        </label>
        <div className="mt-2">
          <input
            name="email"
            type="email"
            required
            autoFocus
            value={email}
            placeholder="enter your email"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            onChange={(e) => updateFields({ email: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
