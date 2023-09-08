import { fetchWrapper } from '_helpers';

const baseUrl = `${process.env.FUNCTION_APP_URL}/api/events`;

// const getById = async (id) => {
//     return await fetchWrapper.get(`${baseUrl}/${id}`);
// };

// const create = async (data) => {
//     return await fetchWrapper.post(`${baseUrl}`, data);
// };

// const getAll = async () => {
//     return await fetchWrapper.get(`${baseUrl}`);
// };

// const deleteById = async (id) => {
//     return await fetchWrapper.delete(`${baseUrl}/${id}`);
// };

// const getScoreboardByEventId = async (id) => {
//     return await fetchWrapper.get(`${baseUrl}/${id}/scores`);
// };

const getById = async (id, userId) => {
    console.log(id, userId)
    return await fetchWrapper.get(`${baseUrl}/${id}/${userId}`);
};

export const eventapi = {
    // getById: getById,
    // create: create,
    // getAll: getAll,
    // deleteById: deleteById,
    // getScoreboardByEventId: getScoreboardByEventId,
    getById: getById
};