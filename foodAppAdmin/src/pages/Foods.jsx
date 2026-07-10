import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/FoodScreen.css";
import { toast } from "react-toastify";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Foods() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [area_code, setAreaCode] = useState("");

    useEffect(() => {
        // loadRestaurants();
    }, []);

    const loadRestaurants = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `${API_BASE_URL}/admin/restaurants`
            );
            setRestaurants(data);
            setLoading(false);
        } catch (err) {
            toast.error("Error loading restaurants.");
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', marginBottom: '20px', justifyContent: 'end' }}>
                <button
                    onClick={() => navigate('/food/add')}
                    className="addBtn">ADD Food</button>
            </div>

            {/* Search */}
            <input
                className="searchBar"
                placeholder="Search foods..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Foods List */}

        </div>
    );
}
