import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { history, signalrHelper } from "_helpers";
import { Nav, Alert, PrivateRoute } from "_components";
import { Home } from "home";
import { AccountLayout } from "./account";
import { UsersLayout } from "./users";
import { EventsLayout } from "./events";
import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect, useState } from "react";
import { AdminLayout } from "admin/AdminLayout";
import { YourProfile } from "./profile";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheckSquare, faCoffee } from "@fortawesome/free-solid-svg-icons";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

library.add(faCheckSquare, faCoffee);

// Initialze the client
const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnmount: false,
      refetchOnReconnect: false,
      retry: false,
      staleTime: twentyFourHoursInMs,
    },
  },
});

export { App };

function App() {
  // init custom history object to allow navigation from
  // anywhere in the react app (inside or outside components)
  history.navigate = useNavigate();
  history.location = useLocation();

  const [connection, setConnection] = useState();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function connectAsync() {
      const c = await signalrHelper.connect(setMessages);
      setConnection(c);
    }
    connectAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="app-container">
          <Nav />
          <Alert />
          <div className="container pt-3 pb-3 sm:w-full sm:max-w-lg md:max-w-screen-lg">
            <Routes>
              {/* private */}
              <Route element={<PrivateRoute />}>
                <Route
                  path="/"
                  element={<Home connection={connection} messages={messages} />}
                />
                <Route path="users/*" element={<UsersLayout />} />
                <Route path="events/*" element={<EventsLayout />} />
                <Route path="admin/*" element={<AdminLayout />} />
              </Route>
              {/* public */}
              <Route path="account/*" element={<AccountLayout />} />
              <Route path="profile/*" element={<YourProfile />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}
