import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/FoodScreen.css";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Restaurants() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        loadRestaurants();
    }, []);

    const loadRestaurants = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `${API_BASE_URL}/restaurants`
            );
            setRestaurants(data);
            setLoading(false);
        } catch (err) {
            console.error("Error loading restaurants:", err.message);
            setLoading(false);
        }
    };

    const filtered = restaurants.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container">
            {/* Location Dropdown */}
            <div className="pickerContainer">
                <select value={location} onChange={(e) => setLocation(e.target.value)}>
                    <option value="">📍 Select Location</option>
                    <option value="newyork">New York</option>
                    <option value="london">London</option>
                    <option value="tokyo">Tokyo</option>
                </select>
            </div>

            {/* Search */}
            <input
                className="searchBar"
                placeholder="Search restaurants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Restaurant List */}
            <div className="list">
                {filtered.map((item) => (
                    <div
                        key={item._id}
                        className="card"
                        onClick={() => navigate(`/restaurant/${item._id}`)}
                    >
                        <img src={item.image_url} alt={item.name} className="image-restaurant" />

                        <div className="details">
                            <h3 className="name">{item.name}</h3>
                            <p className="category">{item.category}</p>

                            <div className="row">
                                <span className="rating">⭐ {item.ratings}</span>
                                <span className="status">{item.status}</span>
                            </div>
                            <button
                                className="addBtn"
                                onClick={(e) => (e.stopPropagation(), navigate(`/restaurant/edit/${item._id}`))}
                            >
                                EDIT
                            </button>
                        </div>

                    </div>
                ))}

                {!loading && filtered.length === 0 && (
                    <p className="emptyText">No restaurants found</p>
                )}
            </div>
        </div>
    );
}
