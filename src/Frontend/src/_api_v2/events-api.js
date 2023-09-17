import { fetchWrapper } from '_helpers';

const baseUrl = `${process.env.REACT_APP_FUNCTION_URL}/api/events`;
const auth = getAuth();

function getAuth() {
    return JSON.parse(localStorage.getItem('auth'));
}

// endpoints

const create = async (data) => {
    console.log('from hehe' + JSON.stringify(data));
    return await fetchWrapper.post(`${baseUrl}/${auth.id}`, data);
};

const getAll = async () => {
    return await fetchWrapper.get(`${baseUrl}/${auth.id}`);
};

const deleteById = async (id) => {
    return await fetchWrapper.delete(`${baseUrl}/${auth.id}/${id}`);
};

const getScoreboardByEventId = async (id) => {
    return await fetchWrapper.get(`${baseUrl}/${auth.id}/${id}/scores`);
};

const getById = async (eventId) => {
    return await fetchWrapper.get(`${baseUrl}/${auth.id}/${eventId}`);
};

export const eventapi = {
    getById: getById,
    create: create,
    getAll: getAll,
    deleteById: deleteById,
    getScoreboardByEventId: getScoreboardByEventId
};