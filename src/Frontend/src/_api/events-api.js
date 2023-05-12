import { fetchWrapper } from '_helpers';

const baseUrl = `${process.env.REACT_APP_API_URL}/events`;

const getById = async (id) => {
    return await fetchWrapper.get(`${baseUrl}/${id}`);
};

const create = async (data) => {
    return await fetchWrapper.post(`${baseUrl}`, data);
};

const getAll = async () => {
    return await fetchWrapper.get(`${baseUrl}`);
};

const deleteById = async (id) => {
    return await fetchWrapper.delete(`${baseUrl}/${id}`);
};

export const eventapi = {
    getById: getById,
    create: create,
    getAll: getAll,
    deleteById: deleteById
};