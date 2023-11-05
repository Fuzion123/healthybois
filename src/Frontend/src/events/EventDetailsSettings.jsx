import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { eventapi } from "_api";
import { history } from "_helpers";
import AlertDialog from "../_components/AlertDialog";
import { useQueryClient } from "react-query";
import { userService } from "_helpers";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

export { EventDetailsSettings };

function EventDetailsSettings({ event }) {
  const queryClient = useQueryClient();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const { dialog, handleClickOpen } = AlertDialog({
    alertText: `Delete this event?`,
    confirmCallback: async () => {
      await eventapi.deleteById(event.id);
      queryClient.invalidateQueries({
        queryKey: [`/user/events/${userService.currentUser.id}`],
      });
      history.navigate("/events");
    },
    cancelCallback: () => handleClose(),
    confirmText: "Delete",
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  async function handleClose(event, callback) {
    setAnchorEl(null);

    if (callback && typeof callback === "function") {
      await callback();
    }
  }

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} disableRipple>
          <EditIcon />
          Edit
        </MenuItem>
        <MenuItem onClick={() => handleClickOpen()} disableRipple>
          <DeleteIcon />
          Delete
        </MenuItem>
      </StyledMenu>
      {dialog}
    </div>
  );
}
