import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { Login, ForgotPassword, ResetPassword } from "./";
import { Registerv2 } from "./register/Registerv2";
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
        <div className="col-sm-8 offset-sm-2">
          <Routes>
            <Route path="login" element={<Login />} />
            <Route path="register_v2" element={<Registerv2 />} />
            <Route path="forgotpassword" element={<ForgotPassword />} />
            <Route path="resetpassword/:code" element={<ResetPassword />} />
            <Route path="/created" element={<AccountCreated />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
