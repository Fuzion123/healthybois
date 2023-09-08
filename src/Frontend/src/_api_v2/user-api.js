import { fetchWrapper } from '_helpers';

const baseUrl = `http://localhost:7149/api/users`;

// const resetpassword = async (code, data) => {
//     return await fetchWrapper.post(`${baseUrl}/resetpassword/${code}`, data);
// };

// const searchUsers = async (term) => {
//     return await fetchWrapper.get(`${baseUrl}/search/${term}`);
// };

const authenticate = async (request) => {
    return await fetchWrapper.post(`${baseUrl}/authenticate`, request);
};

export const userapi = {
    // resetpassword: resetpassword,
    // searchUsers: searchUsers
    authenticate: authenticate
};