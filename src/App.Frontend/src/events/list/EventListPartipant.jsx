import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

export default function EventListPartipant({ participant }) {
  return (
    <div className="ml-1 mt-1">
      <Chip
        avatar={
          <Avatar
            alt={participant.firstName}
            src={participant.profilePictureUrl}
          />
        }
        label={participant.firstName}
      ></Chip>
    </div>
  );
}
