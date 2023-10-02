import { useMultiStepForm } from "./useMultiStepForm";
import { Password } from "./steps/Password";
import { RegisterProgress } from "./RegisterProgress";
import { AccountDetails } from "./steps/AccountDetails";
import { PersonalDetails } from "./steps/PersonalDetails";
import { ProfilePicture } from "./steps/ProfilePicture";
import { useState } from "react";
import { userapi } from "_api";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { alertActions } from "_store";
import { history } from "_helpers";

export { Registerv2 };

const INITIAL_DATA = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  password: "",
  passwordConfirm: "",
  profilePictureUrl: "",
  profilePictureFile: null,
};

function Registerv2() {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(INITIAL_DATA);

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
    <PersonalDetails {...formData} updateFields={updateFields} />,
    <AccountDetails {...formData} updateFields={updateFields} />,
    <ProfilePicture {...formData} updateFields={updateFields} />,
    <Password {...formData} updateFields={updateFields} />,
  ]);

  const createUser = useMutation(
    async (data) => {
      await userapi.register(data);
    },
    {
      onSuccess: () => {
        alert("yay!");
        history.navigate("/account/created");
      },
      onError: (error) => {
        dispatch(alertActions.error(error));
      },
    }
  );

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  async function onSubmit(e) {
    e.preventDefault();

    if (!isLastStep) {
      return next();
    }

    var profilePicture = null;

    if (formData.profilePictureFile) {
      var base64 = await toBase64(formData.profilePictureFile);

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

  return (
    <form
      onSubmit={onSubmit}
      className="flex h-screen flex-col px-3 py-6 lg:px-8 "
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-sm basis-1/3 ">
        <h1 className="mb-4 text-4xl text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          Account creation
        </h1>

        <RegisterProgress
          progress={progress()}
          currentStepCount={currentStepIndex + 1}
          stepsCount={steps.length}
        />
      </div>

      <div className="mt-2 basis-1/3">{step}</div>

      <div className="flex flex-col justify-center mb-20 basis-1/3">
        <button
          disabled={step.hasErrors}
          className="btn-primary disabled:opacity-25"
          type="submit"
        >
          {isLastStep ? "Create" : "Next"}
        </button>
        {!isFirstStep && (
          <button type="button" onClick={back}>
            Back
          </button>
        )}
      </div>
    </form>
  );
}
