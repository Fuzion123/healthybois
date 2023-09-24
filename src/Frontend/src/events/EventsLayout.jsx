import { Routes, Route } from "react-router-dom";
import List from "./List";
import AddEdit from "./AddEdit";
import Details from "./Details";
import AddActivity from "./activities/AddActivity";
import ActivityDetails from "./activities/ActivityDetails";

export { EventsLayout };

function EventsLayout() {
  return (
    <div className="container">
      <Routes>
        <Route index element={<List />} />
        <Route path="add" element={<AddEdit />} />
        <Route path="edit/:id" element={<AddEdit />} />
        <Route path="/:id" element={<Details />} />
        <Route path="/:id/addActivity" element={<AddActivity />} />
        <Route path="/:id/:activityId" element={<ActivityDetails />} />
      </Routes>
    </div>
  );
}
