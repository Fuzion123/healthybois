import { Routes, Route } from 'react-router-dom';

import { AdminPage } from '../admin';

export { AdminLayout };

function AdminLayout() {
    return (
        <div className="p-4">
            <div className="container">
                <Routes>
                    <Route index element={<AdminPage />} />
                </Routes>
            </div>
        </div>
    );
}
