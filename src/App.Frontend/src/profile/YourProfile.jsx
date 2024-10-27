import { useNavigate } from "react-router-dom";
import { userService } from "_helpers";
import { eventapi } from "_api";
import { useQuery } from "react-query";
import BackButton from "_components/BackButton";
import FormElements from "_components/PopupModal";
import { userapi } from "_api";
import { useState } from "react";

export { YourProfile };

function YourProfile(props) {
  const navigate = useNavigate();
  const user = userService.currentUser;
   const [openModal, setOpenModal] = useState();
   
   console.log(openModal);
  
  const { data: userData, error: userError, isLoading: userLoad } = useQuery(
    `/users/${user.id}`,
    async () => {
      return await userapi.getById(user.id);
    }
  );

  const { data: eventData, error: eventError, isLoading: eventLoad } = useQuery(
    `/user/events/${user.id}`,
    async () => {
      return await eventapi.getAll();
    }
  );

  if (eventLoad || userLoad) {
    return (
      <div className="text-center">
        <p className="spinner-border spinner-border-lg align-center"></p>
      </div>
    );
  }

  if (eventError || userError ) {
    return <div>{eventError || userError}</div>;
  }

  console.log(userData);
 

  var today = new Date().toISOString();

  // change "leadingParticipantIds" to the user ID instead of the participant id

  const wonEvents = eventData.filter((event) => {
    return event.leadingParticipantIds.includes(26) && today >= event.endsAt;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Your Profile</h1>
            <div>
        <FormElements userData={userData} title="Edit First Name" modalName="FirstName">
          <p>testing</p>
        </FormElements>
      </div>

      {/* Your information */}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="flex flex-col mt-2 mb-4 shadow-md rounded-lg px-3 pt-2 pb-3 text-center">
          <h2 className="text-lg font-bold mb-2">User Information</h2>
          <div className="text-base py-3 relative">
              <p className="font-bold">First Name:</p>
              <p>
                {userData.firstName}
              </p>         
              <button className="absolute right-1 top-1/2 -translate-y-1/2" onClick={() => setOpenModal("FirstName")}>
                  <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 21">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.418 17.861 1 20l2.139-6.418m4.279 4.279 10.7-10.7a3.027 3.027 0 0 0-2.14-5.165c-.802 0-1.571.319-2.139.886l-10.7 10.7m4.279 4.279-4.279-4.279m2.139 2.14 7.844-7.844m-1.426-2.853 4.279 4.279"/>
                  </svg>
              </button>
          </div>
          <div className="text-base py-3 relative">
              <p className="font-bold">Last Name:</p>
              <p>
                {userData.lastName}
              </p>         
              <button className="absolute right-1 top-1/2 -translate-y-1/2" onClick={() => setOpenModal("LastName")}>
                  <svg className="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 21 21">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7.418 17.861 1 20l2.139-6.418m4.279 4.279 10.7-10.7a3.027 3.027 0 0 0-2.14-5.165c-.802 0-1.571.319-2.139.886l-10.7 10.7m4.279 4.279-4.279-4.279m2.139 2.14 7.844-7.844m-1.426-2.853 4.279 4.279"/>
                  </svg>
              </button>
          </div>
          <div className="text-base py-3">
              <p className="font-bold">Email:</p>
              <p>{userData.email}</p>
          </div>
          <div className="text-base py-3">
              <p className="font-bold">User Name:</p>
              <p> {userData.userName}</p>
          </div>
          <div className="text-base py-3">
              <p className="font-bold">Profile Picture</p>
              <img
                className="mt-1 h-28 w-28 rounded-full m-auto"
                src={userData.profileUrl}
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
