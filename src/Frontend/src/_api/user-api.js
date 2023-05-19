import { fetchWrapper } from '_helpers';

const baseUrl = `${process.env.REACT_APP_API_URL}/Users`;

const resetpassword = async (code, data) => {
    return await fetchWrapper.post(`${baseUrl}/resetpassword/${code}`, data);
};

export const userapi = {
    resetpassword: resetpassword
};