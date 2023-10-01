import { useMultiStepForm } from "./useMultiStepForm";
import { Password } from "./steps/Password";
import { RegisterProgress } from "./RegisterProgress";
import { AccountDetails } from "./steps/AccountDetails";
import { PersonalDetails } from "./steps/PersonalDetails";
import { ProfilePicture } from "./steps/ProfilePicture";

export { Registerv2 };

function Registerv2() {
  const {
    steps,
    currentStepIndex,
    step,
    isFirstStep,
    isLastStep,
    progress,
    next,
    back,
  } = useMultiStepForm([
    <PersonalDetails />,
    <AccountDetails />,
    <ProfilePicture />,
    <Password />,
  ]);

  return (
    <div className="flex h-screen flex-col px-3 py-6 lg:px-8 ">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm basis-1/3 ">
        <h1 class="mb-4 text-4xl text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
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
