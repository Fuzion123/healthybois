import { useNavigate } from 'react-router-dom';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { eventapi } from "_api_v2";
import { date } from '_helpers';
import { useQuery } from 'react-query';
import { userService } from '_components';

export default List;

function List() {
    const navigate = useNavigate();
    
    const {data, error, isLoading} = useQuery(`/user/events/${userService.getUserId()}`, async () => {
        return await eventapi.getAll();
    });
      
    var today = new Date().toISOString();

    const eventStatus = function eventStatus(event) {
        if (event.startsAt <= today && today <= event.endsAt) {
            return (
            <span className='bg-green-400 font-semibold text-white py-1 px-2'>Active</span>
            );                         
        }
        else if (event.startsAt <= today && today >= event.endsAt) {
            return (
            <span className='bg-red-200 font-semibold text-white py-1 px-2'>Event Over</span>
            );                         
        }
        else if (event.startsAt >= today) {
            return (
            <span className='bg-yellow-400 font-semibold text-white py-1 px-2'>Upcomming</span>
            );                         
        }         
    }

    if(isLoading){
        return <div className="text-center">
                    <span className="spinner-border spinner-border-lg align-center"></span>
                </div>
    }

    if(error){
        return <div>{error}</div>
    }
    
    return (
        <div>
            <div className="grid grid-cols-2 gap-2">
            <h1 className="text-2xl font-bold justify-self-start">Events</h1>
                <button  onClick={() => navigate(`/events/add`)} className="mt bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded">
                    Add event
                </button>
            </div>
            
            <div className="grid grid-cols-1 gap-y-2 md:grid-cols-2 md:gap-x-10 lg:grid-cols-3">
            {data?.map(event =>
              <div key={event.id} className="flex flex-col my-8 shadow-md rounded-lg hover:cursor-pointer">
                    <div className="" onClick={() => navigate(`/events/${event.id}`)}>
                        <img className="object-cover w-full h-52 md:h-72 rounded-t-lg" src={event.eventPictureUrl} alt='stock'></img>
                        <h5 className="text-1xl font-bold px-3 py-3">{event.title}</h5>
                        <p className="text-1xl px-3 pb-3">{event.description}</p>
                        <div className="flex flex-wrap justify-between items-center px-3 pb-3 text-xs">
                            <span>Starts at: {date.formatDate(event.startsAt)}</span>
                            {eventStatus(event)}                            
                        </div>
                    </div>
              </div>
            )}
            </div>
        </div>
    );
}
