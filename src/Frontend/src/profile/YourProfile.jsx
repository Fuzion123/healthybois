import { history } from "_helpers";
import { userService } from "_components";
import { eventapi } from "_api";
import { useQuery } from "react-query";

export { YourProfile };

function YourProfile() {
  const user = userService.getUser();

  const { data, error, isLoading } = useQuery(
    `/user/events/${userService.getUserId()}`,
    async () => {
      return await eventapi.getAll();
    }
  );

  if (isLoading) {
    return (
      <div className="text-center">
        <span className="spinner-border spinner-border-lg align-center"></span>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }
  console.log(data);
  const eventData = data.forEach((event) => console.log(event.id));
  console.log(eventData);

  return (
    <div>
      <h1 className="text-2xl font-bold">Your Profile</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex flex-col mt-2 mb-4 shadow-md rounded-lg px-3 pt-2 pb-3">
          <h2 className="text-lg font-bold mb-2">User Information</h2>
          <p className="text-base py-2">
            <span className="font-bold">Name:</span>
            <br></br> {user.firstName} {user.lastName}
          </p>
          <p className="text-base py-2">
            <span className="font-bold">Email:</span>
            <br></br> {user.email}
          </p>
          <p className="text-base py-2">
            <span className="font-bold">User Name:</span>
            <br></br> {user.username}
          </p>
          <p className="text-base py-2">
            <span className="font-bold">Profile Picture</span>
            <br></br>
            <img
              className="mt-1 h-20 w-20 rounded-full"
              src={user.profilePictureUrl}
              alt="Profile pic"
            />
          </p>
        </div>
        <div className="flex flex-col mt-2 mb-4 shadow-md rounded-lg px-3 pt-2 pb-3">
          <h2 className="text-lg font-bold mb-2">Won events</h2>
          <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-10 lg:grid-cols-3">
            {data?.map((event) => (
              <div
                key={event.id}
                className="flex flex-col my-8 shadow-md rounded-lg"
              >
                <div className="">
                  <img
                    className="object-cover w-full h-52 md:h-72 rounded-t-lg"
                    src={event.eventPictureUrl}
                    alt="stock"
                  ></img>
                  <h5 className="text-1xl font-bold px-3 py-3">
                    {event.title}
                  </h5>
                  <p className="text-1xl px-3 pb-3">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button onClick={() => history.navigate(`/`)} className="btn-back">
        <div className="flex justify-center">
          <svg
            className="w-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          <p className="">back</p>
        </div>
      </button>
    </div>
  );
}
