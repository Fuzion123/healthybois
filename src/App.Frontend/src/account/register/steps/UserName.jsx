import { useQuery } from "react-query";
import { userapi } from "_api";
import { useState } from "react";

export { UserName };

function UserName({
  userName,
  updateFields,
  setError,
  setIsLoading,
  userNameAvailable,
}) {
  const [timeoutId, setTimeoutId] = useState(null);

  const { refetch } = useQuery(
    `user/exists/${userName}`,
    async () => {
      if (userName === "") {
        setIsLoading(false);
        return false;
      }

      setIsLoading(true);

      return await userapi.exists({ userName, email: null });
    },
    {
      onSuccess: (exists) => {
        setIsLoading(false);

        if (exists) {
          setError("user name already taken");
          setUserNameAvailable(false);

          return;
        }

        setUserNameAvailable(true);
        setError(null);
      },
      onError(err) {
        setError(err);
        setIsLoading(false);
      },
      enabled: false,
    }
  );

  function onInput(e) {
    updateFields({ userName: e.target.value });
    clearTimeout(timeoutId);
    setUserNameAvailable(false);

    if (e.target.value === "") {
      setIsLoading(false);
      return;
    }

    const id = setTimeout(function () {
      setIsLoading(true);
      refetch();
    }, 300);

    setTimeoutId(id);
  }

  function setUserNameAvailable(value) {
    updateFields({ userNameAvailable: value });
  }

  return (
    <div>
      <div className="">
        <h1 className="mb-2 text-1xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl">
          Account details
        </h1>
      </div>
      <div>
        <label className="block text-md font-medium leading-6 text-gray-900">
          Nick name
        </label>
        <div className="mt-2 relative">
          <div className={userNameAvailable === true ? `checkmark` : ""}>
            <input
              name="username"
              type="text"
              required
              autoFocus
              value={userName}
              placeholder="add a healthy nick name"
              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
              onChange={(e) => onInput(e)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
