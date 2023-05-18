import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export { Home };

function Home() {

    const auth = useSelector(x => x.auth.value);

    if(auth?.isAdmin === true){
        return (
            <div>
                <h1>Hii {auth?.firstName}!</h1>
                <img src={auth?.profilePictureUrl} alt="Profile Pic" /> {/* Add this */}
                <p><Link to="/users">Manage Users</Link></p>
                <p><Link to="/events">Manage Events</Link></p>
            </div>
        );
    }

    return (
        <div>
            <h1>Hii {auth?.firstName}!</h1>
            <img src={auth?.profilePictureUrl} alt="Profile Pic" /> {}
            <p><Link to="/events">Manage Events</Link></p>
        </div>
    );
}
