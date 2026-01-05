import { Link, useLocation } from "react-router-dom";
import "../styles/SideNav.css";

export default function SideNav() {
    const location = useLocation();

    const isActive = (path) =>
        location.pathname === path ? "nav-link active" : "nav-link";

    return (
        <nav className="side-nav">
            <h3 className="nav-title">Fasto</h3>
            <h3 className="nav-title">🍽 Admin Panel</h3>
            <hr />
            <Link to="/" className={isActive("/")}>
                Home
            </Link>

            <Link to="/foods" className={isActive("/foods")}>
                Restaurant
            </Link>

            <Link to="/create" className={isActive("/create")}>
                Create Restaurant
            </Link>

            <Link to="/add-food" className={isActive("/add-food")}>
                Add Food
            </Link>
        </nav>
    );
}
