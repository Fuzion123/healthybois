import { useParams } from 'react-router-dom';
import { history } from '_helpers';

export default ActivityList;

function ActivityList(props) {

  const { id } = useParams();

    if(!props || !props.activities || props.activities.length === 0){
        return (<div>No activities</div>)
    }

    function goTo(p){
      history.navigate(`/events/${id}/${p.id}`);
    }

    return (
        <div>
            <h3 className="text-2xl font-bold mb-2">Activities</h3>
              <div className="flex flex-col justify-between text-gray-900 bg-white border rounded-lg">
                  {props.activities.map((p, index) => (
                    <div
                      onClick={() => goTo(p)}
                      key={p.id}
                      className='relative inline-flex items-center w-full px-2 py-2 text-sm font-medium border-gray-200 cursor-pointer hover:bg-slate-100'
                    >
                      <div className='ml-2 font-bold mr-6'>#{index+1}</div>
                      <div className='text font-bold my-2'>{p.title}</div>
                      {p.completed && 
                        <div className='self-center justify-center m-2'>
                          <svg className="w-3 h-3 m-2 text-green-500 dark:text-green-400 flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                          </svg>
                        </div>
                      }
                    </div>
                  ))}
                </div>
        </div>
    );
}
