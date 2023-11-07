import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useMutation } from "react-query";
import { emailapi } from "_api";
import { useDispatch } from "react-redux";
import { alertActions } from "_store";
import { Header } from "_components/Header";

export { ForgotPassword };

function ForgotPassword() {
  const dispatch = useDispatch();

  // form validation rules
  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required("Email is required"),
  });
  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;

  const mutation = useMutation(
    async (email) => {
      await emailapi.forgotpassword(email);
    },
    {
      onSuccess: () => {
        dispatch(
          alertActions.success({
            message: "An email has been sent out if you have an account",
            showAfterRedirect: true,
          })
        );
      },
    }
  );

  function onSubmit({ email }) {
    return mutation.mutate(email);
  }

  return (
    <div className="flex min-h-full flex-col justify-center lg:px-8 sm:mx-auto sm:w-full sm:max-w-lg">
      <Header title={"Forgot password"} />
      <div className="mt-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <label className="block text-md font-medium leading-6 text-gray-900">
            Email
          </label>
          <div className="mt-2">
            <input
              name="email"
              type="text"
              placeholder="enter email to recover password "
              {...register("email")}
              className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${
                errors.email ? "is-invalid" : ""
              }`}
            />
            <div className="invalid-feedback">{errors.email?.message}</div>
          </div>
          <div>
            <button
              disabled={mutation.isLoading}
              className="btn-primary w-full"
            >
              {mutation.isLoading ? (
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
                  <span className="font-medium">Sending...</span>
                </>
              ) : (
                "Send reset code"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
