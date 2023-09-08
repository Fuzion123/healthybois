import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Login, Register, ForgotPassword, ResetPassword } from './';

export { AccountLayout };

function AccountLayout() {
    const auth = useSelector(x => x.auth.value);

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
                        <Route path="register" element={<Register />} />
                        <Route path="forgotpassword" element={<ForgotPassword />} />
                        <Route path="resetpassword/:code" element={<ResetPassword />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}
