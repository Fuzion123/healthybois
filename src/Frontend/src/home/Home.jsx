import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export { Home };

function Home() {
    const auth = useSelector(x => x.auth.value);

    if(auth?.isAdmin === true){
        return (
            <div>
                <h1>Hi {auth?.firstName}!</h1>
                <p><Link to="/users">Manage Users</Link></p>
                <p><Link to="/cups">Manage Cups</Link></p>
            </div>
        );
    }

    return (
        <div>
            <h1>Hi {auth?.firstName}!</h1>
            <p><Link to="/cups">Manage Cups</Link></p>
        </div>
    );
}
