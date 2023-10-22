import { useMultiStepForm } from "./useMultiStepForm";
import { Password } from "./steps/Password";
import { RegisterProgress } from "./RegisterProgress";
import { Email } from "./steps/Email";
import { FirstName } from "./steps/FirstName";
import { ProfilePicture } from "./steps/ProfilePicture";
import { useState } from "react";
import { userapi } from "_api";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { alertActions } from "_store";
import { history } from "_helpers";
import { LastName } from "./steps/LastName";
import { UserName } from "./steps/UserName";
import { Header } from "_components/Header";
import { imageService } from "_helpers/ImageService";
import { FormStepError } from "_components/FormStepError";

export { Registerv2 };

const INITIAL_DATA = {
  firstName: "",
  lastName: "",
  userName: "",
  userNameAvailable: null,
  email: "",
  emailAvailable: null,
  password: "",
  passwordConfirm: "",
  profilePictureUrl: "",
  profilePictureFile: null,
};

function Registerv2() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(INITIAL_DATA);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function updateFields(fields) {
    setFormData((prev) => {
      return { ...prev, ...fields };
    });
  }

  const {
    steps,
    currentStepIndex,
    step,
    isLastStep,
    isFirstStep,
    progress,
    next,
    back,
  } = useMultiStepForm([
    <FirstName {...formData} updateFields={updateFields} />,
    <LastName {...formData} updateFields={updateFields} />,
    <Email
      {...formData}
      updateFields={updateFields}
      setError={setError}
      setIsLoading={setIsLoading}
    />,
    <UserName
      {...formData}
      updateFields={updateFields}
      setError={setError}
      setIsLoading={setIsLoading}
    />,
    <ProfilePicture {...formData} updateFields={updateFields} />,
    <Password {...formData} updateFields={updateFields} />,
  ]);

  const createUser = useMutation(
    async (data) => {
      setIsLoading(true);
      await userapi.register(data);
    },
    {
      onSuccess: () => {
        setIsLoading(false);
        history.navigate("/account/created");
      },
      onError: (error) => {
        setIsLoading(false);
        dispatch(alertActions.error(error));
      },
    }
  );

  async function onSubmit(e) {
    e.preventDefault();

    if (!isLastStep) {
      return next();
    }

    var profilePicture = null;

    if (formData.profilePictureFile) {
      var base64 = await imageService.toBase64(formData.profilePictureFile);

      profilePicture = {
        name: formData.profilePictureFile.name,
        base64: base64,
      };
    }

    await createUser.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      username: formData.userName,
      password: formData.password,
      passwordConfirm: formData.passwordConfirm,
      profilePicture: profilePicture,
    });
  }

  function previous() {
    setIsLoading(false);
    setError(null);
    back();
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col px-1 py-1 lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Header
            title={"Account creation"}
            overwriteClickHandler={!isFirstStep ? previous : undefined}
          />
          <RegisterProgress
            progress={progress()}
            currentStepCount={currentStepIndex + 1}
            stepsCount={steps.length}
          />
        </div>

        <div className="mt-8 mb-8">
          {step}
          <FormStepError error={error} />
        </div>

        <div className="flex flex-col justify-items-center">
          <button
            disabled={isLoading === true || error !== null}
            className="btn-primary w-full disabled:opacity-60"
            type="submit"
          >
            {isLoading === true ? (
              <>
                <div className="flex justify-center">
                  <svg
                    className="flex mr-3 h-5 w-5 animate-spin text-white"
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
                </div>
              </>
            ) : isLastStep ? (
              "Create"
            ) : (
              "Next"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
