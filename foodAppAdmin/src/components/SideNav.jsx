import { Link, useLocation } from "react-router-dom";
import "../styles/SideNav.css";

export default function SideNav() {
    const location = useLocation();

    const isActive = (path) =>
        location.pathname === path ? "nav-link active" : "nav-link";

    return (
        <nav className="side-nav">
            <h3 className="nav-title">Food App</h3>
            <h3 className="nav-title">🍽 Admin Panel</h3>
            <hr />
            <Link to="/" className={isActive("/")}>
                Home
            </Link>
            <Link to="/orders" className={isActive("/orders")}>
                Orders
            </Link>
            <Link to="/areas/add" className={isActive("/areas/add")}>
                Areas
            </Link>
            <Link to="/areas/list" className={isActive("/areas/list")}>
                Areas List
            </Link>

            <Link to="/restaurants" className={isActive("/restaurants")}>
                Restaurant
            </Link>

            <Link to="/restaurant/add" className={isActive("/restaurant/add")}>
                Create Restaurant
            </Link>

            <Link to="/food/add" className={isActive("/add-food")}>
                Add Food
            </Link>
        </nav>
    );
}
