import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

import { authActions } from "_store";

export { Login };

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // form validation rules
  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;

  function onSubmit({ username, password }) {
    return dispatch(authActions.login({ username, password }));
  }

  return (
    <div className="flex min-h-full flex-col justify-center lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <motion.div
          animate={{
            rotate: [0, 720],
            scale: [1, 2, 1],
            filter: ["none", "brightness(2)", "none"],
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
        >
          <img
            alt="healthybois-logo"
            className="mx-auto h-28 w-28 filter drop-shadow-2xl"
            src={process.env.PUBLIC_URL + "/logo.png"}
          />
        </motion.div>
        <h4 className="mt-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in
        </h4>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <label className="block text-md font-medium leading-6 text-gray-900">
            User name
          </label>
          <div className="mt-2">
            <input
              name="username"
              type="text"
              placeholder="User name or email"
              {...register("username")}
              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                errors.username ? "is-invalid" : ""
              }`}
            />
            <div className="invalid-feedback">{errors.username?.message}</div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <label className="block text-md font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="text-sm"></div>
            </div>
            <div className="">
              <input
                name="password"
                type="password"
                placeholder="at least 6 characters"
                {...register("password")}
                className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                  errors.password ? "is-invalid" : ""
                }`}
              />
              <div className="invalid-feedback">{errors.password?.message}</div>
              <button
                className="float-right mt-2"
                type="reset"
                onClick={() => navigate(`../forgotpassword`)}
              >
                Forgot password?
              </button>
            </div>
          </div>
          <div>
            <button
              disabled={isSubmitting}
              type="submit"
              className="flex btn-primary w-full justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="mr-3 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="font-medium">Logging in...</span>
                </>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>
        <div className="flex justify-between mt-3">
          <p>Not a healthy boi yet?</p>
          <button
            onClick={() => navigate(`../register`)}
            className="flex items-center"
          >
            <span className="font-bold text-primary-600 underline mr-1">
              Sign up!
            </span>
            <img
              alt="healthybois-logo"
              className="mx-auto h-5 w-5 filter drop-shadow-2xl"
              src={process.env.PUBLIC_URL + "/images/flex_arm.png"}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
