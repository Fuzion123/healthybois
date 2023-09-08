import { userapi, eventapi } from "_api_v2";
import { useMutation, useQuery } from "react-query";

export { AdminPage };

function AdminPage() {

    const authenticateMutation = useMutation(async (request) => {
        return await userapi.authenticate(request);
      }, {
        onSuccess: (data) => {
          console.log(data);
        },
        onError: (err) => {
            console.log(err);
        }
      });

      // query
    const {data, error, isLoading} = useQuery(`event`, async (eventId, userId) => {
        return await eventapi.getById(eventId, userId);
    },{
        onSuccess: (d) => {
        
        }
    }
    );

    async function Login(userName, password){
        var t = {userName, password};
        console.log(t)
        await authenticateMutation.mutate(t);
    }

    if(isLoading)
    return 'loading...'

    if(error){
        return error;
    }

    return (
        <div>
            <div>
                {data}
            </div>

            <button onClick={() => Login('fuzion','toppak123')}>Press here</button>
        </div>
    )

}