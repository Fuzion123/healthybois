import { eventapi } from "_api_v2";
import { useQuery } from "react-query";

export { AdminPage };

function AdminPage() {

      // query
    const {data, error, isLoading} = useQuery(`event`, async () => {
        return await eventapi.getById();
    },{
        onSuccess: (data) => {
            console.log(data)
        }
    }
    );

    if(isLoading)
        return 'loading...'

    if(error){
        return error;
    }

    return (
        <div>
            {data && 
                <div>
                    {JSON.stringify(data)}
                </div>
            }
        </div>
    )
}