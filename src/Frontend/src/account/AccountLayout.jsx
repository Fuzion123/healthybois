import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Login, ForgotPassword, ResetPassword } from "./";
import { Register } from "./register/Register";
import { AccountCreated } from "./register/AccountCreated";

export { AccountLayout };

function AccountLayout() {
  const auth = useSelector((x) => x.auth.value);

  // redirect to home if already logged in
  if (auth) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container">
      <div className="row">
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="resetpassword/:code" element={<ResetPassword />} />
          <Route path="/created" element={<AccountCreated />} />
        </Routes>
      </div>
    </div>
  );
}
