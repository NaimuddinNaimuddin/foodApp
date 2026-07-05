import { Link, useLocation } from "react-router-dom";
import "../styles/SideNav.css";

export default function SideNav() {
    const location = useLocation();

    const isActive = (path) =>
        path.indexOf(location.pathname) !== -1 ? "nav-link active" : "nav-link";

    return (
        <nav className="side-nav">
            <h3 className="nav-title">Food App</h3>
            <h3 className="nav-title">🍽 Admin Panel</h3>
            <hr />
            <Link to="/" className={isActive(["/"])}>
                Home
            </Link>
            <Link to="/areas/list" className={isActive(["/areas/list", "/areas/add"])}>
                Areas
            </Link>
            <Link to="/restaurants" className={isActive(["/restaurants", "/restaurant/add"])}>
                Restaurants
            </Link>
            <Link to="/foods" className={isActive(["/foods"])}>
                Foods
            </Link>
            <Link to="/orders" className={isActive(["/orders"])}>
                Orders
            </Link>
        </nav>
    );
}
