import { useNavigate } from "react-router-dom";
import { userService } from "_helpers";
import { eventapi } from "_api";
import { useQuery } from "react-query";
import BackButton from "_components/BackButton";
import FormElements from "_components/PopupModal";

export { YourProfile };

function YourProfile(modalId, props) {
  const navigate = useNavigate();
  const user = userService.currentUser;

  const { data, error, isLoading } = useQuery(
    `/user/events/${user.id}`,
    async () => {
      return await eventapi.getAll();
    }
  );

  if (isLoading) {
    return (
      <div className="text-center">
        <p className="spinner-border spinner-border-lg align-center"></p>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  var today = new Date().toISOString();

  // change "leadingParticipantIds" to the user ID instead of the participant id

  const wonEvents = data.filter((event) => {
    return event.leadingParticipantIds.includes(26) && today >= event.endsAt;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Your Profile</h1>
            <div>
        <FormElements title="Edit Email" modalName="form-elements">
          <p>testing</p>
        </FormElements>
      </div>

      {/* Your information */}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex flex-col mt-2 mb-4 shadow-md rounded-lg px-3 pt-2 pb-3 text-center">
          <h2 className="text-lg font-bold mb-2">User Information</h2>
          <div className="text-base py-3 relative">
              <p className="font-bold">Name:</p>
              <p>
                {user.firstName} {user.lastName}
              </p>         
              <button className="absolute right-1 top-1/2 -translate-y-1/2" onClick={() => props.setOpenModal(modalId)}>
                  <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 21">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.418 17.861 1 20l2.139-6.418m4.279 4.279 10.7-10.7a3.027 3.027 0 0 0-2.14-5.165c-.802 0-1.571.319-2.139.886l-10.7 10.7m4.279 4.279-4.279-4.279m2.139 2.14 7.844-7.844m-1.426-2.853 4.279 4.279"/>
                  </svg>
              </button>
          </div>
          <div className="text-base py-3">
              <p className="font-bold">Email:</p>
              <p>{user.email}</p>
          </div>
          <div className="text-base py-3">
              <p className="font-bold">User Name:</p>
              <p> {user.username}</p>
          </div>
          <div className="text-base py-3">
              <p className="font-bold">Profile Picture</p>
              <img
                className="mt-1 h-28 w-28 rounded-full m-auto"
                src={user.profilePictureUrl}
                alt="Profile pic"
              />
          </div>
        </div>


        {/* Won events */}

        <div className="flex flex-col mt-2 mb-4 shadow-md rounded-lg px-3 pt-2 pb-3">
          <h2 className="text-lg font-bold mb-2 text-center">Won events</h2>
          <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-10 lg:grid-cols-3">
            {wonEvents?.map((event) => (
              <div
                key={event.id}
                className="flex flex-col my-8 shadow-md rounded-lg"
              >
                <div
                  className=""
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <img
                    className="object-cover w-full h-52 md:h-72 rounded-t-lg"
                    src={event.eventPictureUrl}
                    alt="stock"
                  ></img>
                  <h5 className="text-1xl font-bold px-3 py-3">
                    {event.title}
                  </h5>
                  <div className="text-1xl px-3 pb-3">{event.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="btn-back text-center">
        <BackButton customClassName="text-1xl" title="Back" useTitleAndLogo></BackButton>
      </div>

    </div>
  );
}
