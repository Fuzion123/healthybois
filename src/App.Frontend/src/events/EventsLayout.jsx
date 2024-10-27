import { Routes, Route } from "react-router-dom";
import EventList from "./list/EventList";
import AddEdit from "./AddEdit";
import Details from "./detail/Details";
import AddActivity from "./activities/create/AddActivity";
import ActivityDetails from "./activities/detail/ActivityDetails";
import { CreateEvent } from "./create/CreateEvent";

export { EventsLayout };

function EventsLayout() {
  return (
    <div className="container">
      <Routes>
        <Route index element={<EventList />} />
        <Route path="add" element={<CreateEvent />} />
        <Route path="edit/:id" element={<AddEdit />} />
        <Route path="/:id" element={<Details />} />
        <Route path="/:id/addActivity" element={<AddActivity />} />
        <Route path="/:id/:activityId" element={<ActivityDetails />} />
      </Routes>
    </div>
  );
}
