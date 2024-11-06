import { fetchWrapper } from "_helpers";

const baseUrl = `${process.env.REACT_APP_API_URL}/activities`;

const getById = async (eventId, activityId) => {
  return await fetchWrapper.get(`${baseUrl}/${eventId}/${activityId}`);
};

const create = async (id, data) => {
  return await fetchWrapper.post(`${baseUrl}/${id}`, data);
};

const update = async (eventId, activityId, data) => {
  return await fetchWrapper.put(`${baseUrl}/${eventId}/${activityId}`, data);
};

const getAllForEvent = async (eventId) => {
  return await fetchWrapper.get(`${baseUrl}/${eventId}`);
};

const deleteById = async (eventId, activityId) => {
  return await fetchWrapper.delete(`${baseUrl}/${eventId}/${activityId}`);
};

const getAllForEventListingViewmodel = async (eventId) => {
  return await fetchWrapper.get(`${baseUrl}/${eventId}/eventlistingviewmodel`);
};

export const activityapi = {
  getById: getById,
  create: create,
  update: update,
  getAllForEvent: getAllForEvent,
  deleteById: deleteById,
  getAllForEventListingViewmodel: getAllForEventListingViewmodel,
};
