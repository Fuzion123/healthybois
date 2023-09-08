import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { history, signalrHelper } from '_helpers';
import { Nav, Alert, PrivateRoute } from '_components';
import { Home } from 'home';
import { AccountLayout } from './account';
import { UsersLayout } from './users';
import { EventsLayout } from './events';
import {QueryClient, QueryClientProvider} from 'react-query';
import { useEffect, useState } from 'react';
import { AdminLayout } from 'admin/AdminLayout';


// Initialze the client
const queryClient = new QueryClient();

export { App };

function App() {
    // init custom history object to allow navigation from 
    // anywhere in the react app (inside or outside components)
    history.navigate = useNavigate();
    history.location = useLocation();
    
    const [connection, setConnection] = useState();
    const [messages, setMessages] = useState([]);

    useEffect(()=>{
        async function connectAsync() {
            const c = await signalrHelper.connect(setMessages);
            setConnection(c);
          }
          connectAsync();
    }, [])

    return (
        <QueryClientProvider client={queryClient}>
            <div className="app-container xs ">
                <Nav />
                <Alert />
                <div className="container pt-4 pb-4">
                    <Routes>
                        {/* private */}
                        <Route element={<PrivateRoute />}>
                            <Route path="/" element={<Home connection= { connection } messages = {messages} />} />
                            <Route path="users/*" element={<UsersLayout />} />
                            <Route path="events/*" element={<EventsLayout />} />
                            <Route path="admin/*" element={<AdminLayout />} />
                        </Route>
                        {/* public */}
                        <Route path="account/*" element={<AccountLayout />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </div>
        </QueryClientProvider>
        
    );
}
