export default function EventStatus({ event }) {
  if (event.active === true) {
    return (
      <span className="bg-green-400 font-semibold text-white py-1 px-2">
        Active
      </span>
    );
  } else if (event.completed === true) {
    return (
      <span className="bg-teal-200 font-semibold text-white py-1 px-2">
        Completed
      </span>
    );
  } else if (event.upcoming === true) {
    return (
      <span className="bg-yellow-400 font-semibold text-white py-1 px-2">
        Upcoming
      </span>
    );
  }
}
