import { useNavigate } from "react-router-dom";
import { userService } from "_helpers";
import { eventapi } from "_api";
import { useQuery } from "react-query";
import BackButton from "_components/BackButton";

export { YourProfile };

function YourProfile() {
  const navigate = useNavigate();
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

  var today = new Date().toISOString();

  // change "leadingParticipantIds" to the user ID instead of the participant id
  
  const wonEvents = data.filter(event => {
    return event.leadingParticipantIds === user.id && today >= event.endsAt;

  });
  console.log(wonEvents);
  

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
            {wonEvents?.map((event) => (
              <div
                key={event.id}
                className="flex flex-col my-8 shadow-md rounded-lg"
              >
                <div className="" onClick={() => navigate(`/events/${event.id}`)}>
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
      <div className="btn-back text-center">
        <BackButton title="Back"></BackButton>
      </div>
      
    </div>
  );
}
