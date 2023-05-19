import { fetchWrapper } from '_helpers';

const baseUrl = `${process.env.REACT_APP_API_URL}/Email`;

const forgotpassword = async (data) => {
    return await fetchWrapper.post(`${baseUrl}/forgotpassword`, data);
};

const invite = async (data) => {
    return await fetchWrapper.post(`${baseUrl}/invite`, data);
};

export const emailapi = {
    forgotpassword: forgotpassword,
    invite: invite
};