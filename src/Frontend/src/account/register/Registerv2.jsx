import { useMultiStepForm } from "./useMultiStepForm";
import { Password } from "./steps/Password";
import { Email } from "./steps/Email";
import { RegisterProgress } from "./RegisterProgress";
import { UserName } from "./steps/UserName";
import { FirstNameLastName } from "./steps/FirstNameLastName";
import { ProfilePicture } from "./steps/ProfilePicture";

export { Registerv2 };

function Registerv2() {
  const { step, isFirstStep, isLastStep, progress, next, back } =
    useMultiStepForm([
      <FirstNameLastName />,
      <UserName />,
      <Email />,
      <ProfilePicture />,
      <Password />,
    ]);

  return (
    <div className="flex h-screen flex-col px-3 py-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm basis-1/3">
        <h5 className="mt-10 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">
          Add a Healthy Boi
        </h5>
        <RegisterProgress progress={progress()} />
      </div>

      <div className="mt-2 basis-1/3">{step}</div>

      <div className="flex flex-col justify-center mb-20 basis-1/3">
        {!isLastStep && (
          <button className="btn-primary" onClick={() => next()}>
            Next
          </button>
        )}
        {isLastStep && (
          <button className="btn-primary" onClick={() => next()}>
            Create!
          </button>
        )}
        <button
          className={`${isFirstStep ? "invisible" : "visible"}`}
          onClick={() => back()}
        >
          Back
        </button>
      </div>
    </div>
  );
}
