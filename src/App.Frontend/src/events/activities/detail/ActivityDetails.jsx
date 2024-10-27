import { activityapi } from "_api";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { useParams } from "react-router-dom";
import ActivityResult from "../results/ActivityResult";
import { history } from "_helpers";
import { useState } from "react";
import { Header } from "_components/Header";
import { Settings } from "./Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";

export default ActivityDetails;

function ActivityDetails() {
  const { activityId } = useParams();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data, error, isLoading } = useQuery(
    `/activityapi.getById/${id}/${activityId}`,
    async () => {
      return await activityapi.getById(id, activityId);
    },
    {
      onSuccess: (d) => {},
    }
  );

  const deleteMutation = useMutation(
    async () => {
      setIsProcessing(true);
      await activityapi.deleteById(id, activityId);
      setIsProcessing(false);
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: [`/getById/${id}`],
        });

        queryClient.invalidateQueries({
          queryKey: [`scoreboard/${id}`],
        });
      },
      onError: (err) => {
        setIsProcessing(false);
        queryClient.invalidateQueries({ queryKey: [] });
      },
    }
  );

  const toggleCompleteMutation = useMutation(
    async (val) => {
      if (val === true) {
        await activityapi.markUnDone(id, activityId);
      } else {
        await activityapi.markDone(id, activityId);
      }

      queryClient.invalidateQueries({
        queryKey: [`/activityapi.getById/${id}/${activityId}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`/getById/${id}`],
      });
    },
    {
      onSuccess: () => {
        setIsProcessing(false);
      },
      onError: (err) => {
        setIsProcessing(false);
      },
    }
  );

  async function toggleComplete(val) {
    setIsProcessing(true);
    await toggleCompleteMutation.mutate(val);
  }

  if (error) return <div>Request Failed</div>;

  if (isLoading)
    return (
      <div className="text-center">
        <span className="spinner-border spinner-border-lg align-center"></span>
      </div>
    );

  return (
    <div className="">
      <Header
        className="flex flex-row justify-between text-base/6"
        title={data.title}
        overwriteClickHandler={() => {
          history.navigate(`/events/${id}`);
        }}
        settings={
          <Settings>
            <MenuItem disableRipple>
              <EditIcon />
              Edit
            </MenuItem>
            <MenuItem
              disableRipple
              onClick={async () => {
                var result = window.confirm("Delete the item?");

                if (result === true) {
                  await deleteMutation.mutate();
                  history.navigate(`/events/${id}`);
                }
              }}
            >
              <DeleteIcon />
              Delete
            </MenuItem>
          </Settings>
        }
      ></Header>

      <br></br>
      {!isLoading && (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            onChange={() => toggleComplete(data.completed)}
            checked={data.completed}
            value=""
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ml-3 text-m font-medium text-black-300">
            Completed
          </span>
          {isProcessing ? (
            <div className="ml-4 max-h-4 text-center">
              <span className="spinner-border spinner-border-lg align-center"></span>
            </div>
          ) : (
            <></>
          )}
        </label>
      )}
      <br></br>
      <br></br>
      <h4 className="text-x3 font-bold mb-2">Results</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.participants.map((p, i) => {
          return (
            <div key={p.participant.id} className="">
              <ActivityResult
                eventId={id}
                activityId={activityId}
                participant={p.participant}
                result={p.result}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
