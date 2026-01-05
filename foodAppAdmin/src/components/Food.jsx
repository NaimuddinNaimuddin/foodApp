import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/Food.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function RestaurantScreen() {
    const { id } = useParams();

    const [foodItems, setFoodItems] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const selectedItems =
        foodItems.find((c) => c.category === selectedCategory)?.items || [];

    useEffect(() => {
        if (!id) return;

        const fetchFoodItems = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    `${API_BASE_URL}/food/${id}/food-items`
                );

                setFoodItems(res.data);

                if (res.data.length > 0) {
                    setSelectedCategory(res.data[0].category);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load food items");
            } finally {
                setLoading(false);
            }
        };

        fetchFoodItems();
    }, [id]);

    const addToCart = async (foodId) => {
        try {
            await axios.post(`${API_BASE_URL}/cart/add`, {
                userId: "64a3f7c6b9c12345abcde678",
                foodId,
            });

            toast.success("Added to Cart 🛒");
        } catch {
            toast.error("Failed to add item");
        }
    };

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="errorText">{error}</p>;

    return (
        <div className="container">
            {/* Category Tabs */}
            <div className="tabs">
                {foodItems.map((cat) => {
                    const active = cat.category === selectedCategory;

                    return (
                        <button
                            key={cat.category}
                            className={`tab ${active ? "active" : ""}`}
                            onClick={() => setSelectedCategory(cat.category)}
                        >
                            {cat.category}
                        </button>
                    );
                })}
            </div>

            {/* Food List */}
            <div className="foodList">
                {selectedItems.length === 0 && (
                    <p className="emptyText">No items available</p>
                )}

                {selectedItems.map((item) => (
                    <div className="card" key={item._id}>
                        <div>
                            <img
                                src={item.image_url}
                                alt={item.name}
                                className="image"
                            />
                        </div>
                        <div className="info">
                            <p className="foodName">{item.name}</p>
                            <p className="price">₹{item.price.toFixed(2)}</p>

                            <button
                                className="addBtn"
                                onClick={() => addToCart(item._id)}
                            >
                                ADD
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
