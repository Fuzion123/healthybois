import { useNavigate } from "react-router-dom";

export { AccountCreated };

function AccountCreated() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col">
      <div className="flex justify-center basis-1/12 mt-8">
        <h1 className="mb-4 text-4xl text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          Great work!
        </h1>
      </div>
      <div className="flex flex-col justify-center items-center basis-10/12">
        <div className="">
          <p className="flex content-center text-1xl font">
            You are successfully created in our system
          </p>
        </div>
      </div>
      <div className="flex justify-center basis-1/12 mb-28">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="btn-primary"
        >
          Go to login
        </button>
      </div>
    </div>
  );
}
