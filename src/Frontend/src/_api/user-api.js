import { fetchWrapper } from "_helpers";

const baseUrl = `${process.env.REACT_APP_API_URL}/Users`;

const resetpassword = async (code, data) => {
  return await fetchWrapper.post(`${baseUrl}/resetpassword/${code}`, data);
};

const searchUsers = async (term) => {
  return await fetchWrapper.get(`${baseUrl}/search/${term}`);
};

const register = async (data) => {
  return await fetchWrapper.post(`${baseUrl}/register`, data);
};

const exists = async (request) => {
  return await fetchWrapper.post(`${baseUrl}/exists`, request);
};

const editFirstName = async (data) => {
  return await fetchWrapper.put(`${baseUrl}/edit/firstname`, data);
};

export const userapi = {
  resetpassword: resetpassword,
  searchUsers: searchUsers,
  register: register,
  exists: exists,
  editFirstName: editFirstName,
};
