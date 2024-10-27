import { eventapi } from "_api";
import { useQuery } from "react-query";

export { AdminPage };

function AdminPage() {
  // query
  const { data, error, isLoading } = useQuery(`event`, async () => {
    return await eventapi.getAll();
  });

  if (isLoading) return "loading...";

  if (error) {
    return error;
  }

  return <div>{data && <div>{JSON.stringify(data)}</div>}</div>;
}
