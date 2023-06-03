import { fetchWrapper } from "_helpers";
import { useQuery } from "react-query";

export { Messages };

function Messages(){

       // query
  const {data, error, isLoading} = useQuery('yo', () => {
    return fetchWrapper.get(`api/HelloWorld`);
  });

  if (error) return <div>Request Failed</div>;

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
        <section className="mb-8">
        <h2 className="text-xl font-bold mb-4">Incoming messages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-8">
            <h3 className="text-md font-bold mb-2">Fuzion</h3>
            <p className="text-gray-600">{data.message}</p>
            </div>
        </div>
        </section>
    </div>
  )
}