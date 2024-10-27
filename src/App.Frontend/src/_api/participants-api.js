import { fetchWrapper } from '_helpers';

const baseUrl = `${process.env.REACT_APP_API_URL}/participants`;

const getByEventId = async (id) => {
    return await fetchWrapper.get(`${baseUrl}/${id}`);
};

export const participantsapi = {
    getByEventId: getByEventId,
};