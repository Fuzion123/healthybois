import { useQuery } from "react-query";
import { userapi } from "_api";
import { useState } from "react";

export { Email };

function Email({
  email,
  updateFields,
  setError,
  setIsLoading,
  emailAvailable,
}) {
  const [timeoutId, setTimeoutId] = useState(null);

  const { refetch } = useQuery(
    `user/exists/${email}`,
    async () => {
      if (email === "") {
        setIsLoading(false);
        return false;
      }

      setIsLoading(true);

      return await userapi.exists({ userName: null, email });
    },
    {
      onSuccess: (exists) => {
        setIsLoading(false);

        if (exists) {
          setError("email already taken");
          setEmailAvailable(false);

          return;
        }

        setEmailAvailable(true);
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
    updateFields({ email: e.target.value });
    clearTimeout(timeoutId);
    setEmailAvailable(false);

    if (e.target.value === "") {
      setIsLoading(false);
      return;
    }

    var c = validateEmail(e.target.value);

    if (c === false) return;

    const id = setTimeout(function () {
      setIsLoading(true);
      refetch();
    }, 300);

    setTimeoutId(id);
  }

  function setEmailAvailable(value) {
    updateFields({ emailAvailable: value });
  }

  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

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
        <div className="mt-2 relative">
          <div className={emailAvailable === true ? `checkmark` : ""}>
            <input
              name="email"
              type="email"
              required
              autoFocus
              value={email}
              placeholder="enter your email"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={(e) => onInput(e)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
