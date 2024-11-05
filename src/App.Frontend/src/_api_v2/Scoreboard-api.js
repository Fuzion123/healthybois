import { fetchWrapper } from "_helpers";

const baseUrl = `${process.env.REACT_APP_API_URL}/scoreboard`;

const getByEventId = async (id, limitedToActivities) => {
  return await fetchWrapper.get(
    `${baseUrl}/${id}?limitedToActivities=${limitedToActivities}`
  );
};

export const Scoreboardapi = {
  getByEventId: getByEventId,
};
