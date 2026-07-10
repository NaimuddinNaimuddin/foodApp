import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/FoodScreen.css";
import { toast } from "react-toastify";
import FoodTable from "../components/FoodTable";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Foods() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [search, setSearch] = useState("");
    const [foods, setfoods] = useState([]);
    const [area_code, setAreaCode] = useState("");

    useEffect(() => {
        loadFoods();
    }, []);

    const loadFoods = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${API_BASE_URL}/admin/food/list`);
            setfoods(data);
        } catch (err) {
            toast.error("Error loading foods.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div style={{ display: 'flex', marginBottom: '20px', justifyContent: 'end' }}>
                <button
                    onClick={() => navigate('/food/add')}
                    className="addBtn">
                    ADD Food
                </button>
            </div>

            <input
                className="searchBar"
                placeholder="Search foods..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <FoodTable foods={foods} />
        </div>
    );
}
