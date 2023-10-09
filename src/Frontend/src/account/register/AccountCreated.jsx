import { useNavigate } from "react-router-dom";

export { AccountCreated };

function AccountCreated() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col">
      <div className="flex justify-center mt-8">
        <h1 className="mb-4 text-4xl text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          Great work!
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center mb-12">
        <div className="flex flex-row">
          <p className="flex content-center text-1xl font mr-2">You did it!</p>
          <img
            alt="healthybois-logo"
            className="mx-auto h-5 w-5 filter drop-shadow-2xl"
            src={process.env.PUBLIC_URL + "/images/flex_arm.png"}
          />
        </div>
      </div>
      <div className="flex justify-center mb-28">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="btn-primary"
        >
          Sign in now!
        </button>
      </div>
    </div>
  );
}
