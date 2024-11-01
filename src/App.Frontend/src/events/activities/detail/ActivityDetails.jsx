import { activityapi, resultapi } from "_api";
import { useQuery, useQueryClient, useMutation } from "react-query";
import { useParams } from "react-router-dom";
import ActivityResult from "../results/ActivityResult";
import { history } from "_helpers";
import { useState } from "react";
import { Header } from "_components/Header";
import { Settings } from "./Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuItem from "@mui/material/MenuItem";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export default ActivityDetails;

function ActivityDetails() {
  const { activityId } = useParams();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [scores, setScores] = useState([]);

  var updateScore = function (participantId, score) {
    const updatedScores = [...scores];

    const participant = updatedScores.find(
      (a) => a.participantId === participantId
    );

    if (participant && participant !== null) {
      participant.score = score;
    } else {
      updatedScores.push({
        participantId: participantId,
        score: score,
      });
    }

    setScores(updatedScores);
  };

  const { data, error, isLoading } = useQuery(
    `/activityapi.getById/${id}/${activityId}`,
    async () => {
      return await activityapi.getById(id, activityId);
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

  const saveMutation = useMutation(
    async (scores) => {
      if (scores.length === 0) {
        history.navigate(`/events/${id}`);
      }

      setIsProcessing(true);

      await resultapi.AddOrUpdateResult(id, activityId, scores);
    },
    {
      onSuccess: () => {
        setIsProcessing(false);
        queryClient.invalidateQueries({
          queryKey: `/getById/${id}`,
        });

        queryClient.invalidateQueries({
          queryKey: [`/activityapi.getById/${id}/${activityId}`],
        });

        console.log("navigating back");
        history.navigate(`/events/${id}`);
      },
      onError: (err) => {
        setIsProcessing(false);
      },
    }
  );

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
        overwriteClickHandler={async () => {
          history.navigate(`/events/${id}`);
        }}
        settings={
          <Settings>
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
              <RestartAltIcon />
              Reset scores
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
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
                updateScore={updateScore}
              />
            </div>
          );
        })}
      </div>

      <button
        disabled={isProcessing}
        className="mt-10 btn-primary"
        onClick={() => saveMutation.mutate(scores)}
      >
        {isProcessing ? (
          <>
            <span className="spinner-border spinner-border-sm me-1"></span>
            <span className="font-medium">Processing...</span>
          </>
        ) : (
          "Nice, save that! 🍆🍑"
        )}
      </button>
    </div>
  );
}
