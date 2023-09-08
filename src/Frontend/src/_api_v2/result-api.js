import { fetchWrapper } from '_helpers';

const baseUrl = `${process.env.REACT_APP_API_URL}/results`;

const AddOrUpdateResult = async (eventId, activityId, data) => {
    return await fetchWrapper.put(`${baseUrl}/${eventId}/${activityId}`, data);
};

const getById = async (eventId, activityId) => {
    return await fetchWrapper.get(`${baseUrl}/${eventId}/${activityId}`);
};

const getAll = async (eventId, activityId) => {
    return await fetchWrapper.get(`${baseUrl}/${eventId}/${activityId}`);
};

const deleteById = async (id) => {
    return await fetchWrapper.delete(`${baseUrl}/${id}`);
};

export const resultapi = {
    AddOrUpdateResult: AddOrUpdateResult,
    getById: getById,
    getAll: getAll,
    deleteById: deleteById
};