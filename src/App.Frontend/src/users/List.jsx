import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "_store";
import { useNavigate } from "react-router-dom";

export { List };

function List() {
  const users = useSelector((x) => x.users.list);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(userActions.getAll());
  }, []);

  const handleEditClick = (id) => {
    navigate(`edit/${id}`);
  };

  return (
    <div>
      <h1>Users</h1>
      <div className="flex flex-wrap">
        {users?.value?.map((user) => (
          <div key={user.id} className="card m-2" style={{ width: "18rem" }}>
            <div className="card-body d-flex justify-content-between">
              <h5
                className="card-title"
                onClick={() => handleEditClick(user.id)}
              >
                {user.firstName}
              </h5>
              <button
                onClick={() => dispatch(userActions.delete(user.id))}
                className="btn-negative w-1/2 text-sm"
                disabled={user.isDeleting}
              >
                {user.isDeleting ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        ))}
        {users?.loading && (
          <div className="text-center">
            <span className="spinner-border spinner-border-lg align-center"></span>
          </div>
        )}
      </div>
      <button
        onClick={() => navigate(`/users/add`)}
        className="btn-primary md:m-2 mt-4"
      >
        Add User
      </button>
    </div>
  );
}
