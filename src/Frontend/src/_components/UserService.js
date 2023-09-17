
const auth = getAuth();

function getAuth() {
    return JSON.parse(localStorage.getItem('auth'));
}

const getUserId = () => {
    return auth?.id;
};

const getUser = () => {
    return auth;
}

const hehehe = () => {
    return "hello from hehehe"
}

export const userService = {
    getUserId: getUserId,
    getUser: getUser,
    yoyoyo: hehehe
};