import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export { Home };

function Home() {

    const auth = useSelector(x => x.auth.value);

    if(auth?.isAdmin === true){
        return (
            <div>
                <h1>Hi {auth?.firstName}!</h1>
                <img src={auth?.profilePicture} alt="Profile Pic" /> {/* Add this */}
                <p><Link to="/users">Manage Users</Link></p>
                <p><Link to="/events">Manage Cups</Link></p>
            </div>
        );
    }

    return (
        <div>
            <h1>Hi {auth?.firstName}!</h1>
            <img src={auth?.profilePicture} alt="Profile Pic" /> {}
            <p><Link to="/events">Manage Cups</Link></p>
        </div>
    );
}
