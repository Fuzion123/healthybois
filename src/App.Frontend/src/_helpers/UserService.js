const auth = getAuth();

function getAuth() {
  return JSON.parse(localStorage.getItem("auth"));
}

export const userService = {
  currentUser: auth,
};
