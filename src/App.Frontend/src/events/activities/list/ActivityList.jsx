import React, { useEffect } from "react";
import { history } from "_helpers";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { activityapi } from "_api_v2";
import { Settings } from "../detail/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuItem from "@mui/material/MenuItem";

export default function ActivityList({ eventId }) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQuery(
    `/activities/${eventId}}/eventlistingviewmodel`,
    async () => {
      return await activityapi.getAllForEventListingViewmodel(eventId);
    }
  );

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteMutation = useMutation(
    async (activityId) => {
      await activityapi.deleteById(eventId, activityId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [`/activities/${eventId}}/eventlistingviewmodel`],
        });
      },
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    <div>{error}</div>;
  }

  return (
    <div>
      {data.length === 0 ? (
        <div>No activities</div>
      ) : (
        <div>
          <h3 className="text-1xl font-bold mb-2">Activities</h3>
          <ul className="">
            {data.map((activity, index) => (
              <li
                key={index}
                className="m-1 pl-2 py-2 sm:pb-4 border border-gray-200 rounded"
              >
                <div className="flex items-center">
                  <div
                    className="flex-1"
                    onClick={() =>
                      history.navigate(`/events/${eventId}/${activity.id}`)
                    }
                  >
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {activity.completedOnPrettyText}
                    </p>
                  </div>
                  {activity.completed && (
                    <div className="flex-col justify-items-center">
                      <img
                        className="w-8 h-8 rounded-full"
                        src={activity.winner.profilePictureUrl}
                        alt={`${activity.winner.firstName}'s Profile`}
                      />
                      <p className="text-xs">winner 🏆</p>
                    </div>
                  )}
                  <Settings>
                    <MenuItem
                      disableRipple
                      onClick={() => {
                        deleteMutation.mutate(activity.id);
                      }}
                    >
                      <DeleteIcon />
                      Delete
                    </MenuItem>
                  </Settings>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => history.navigate(`/events/${eventId}/addActivity`)}
        className="mt-3 btn-primary"
      >
        Add Activity
      </button>
    </div>
  );
}
