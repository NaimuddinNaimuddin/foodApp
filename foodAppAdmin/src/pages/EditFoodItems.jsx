import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { uploadImageToCloudinary } from "../services/imageUpload";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditFoodItem() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [mrp, setMrp] = useState("");
    const [quantityInfo, setQuantityInfo] = useState("");
    const [category, setCategory] = useState("");
    const [shortDesc, setShortDesc] = useState("");
    const [longDesc, setLongDesc] = useState("");
    const [image, setImage] = useState(null);

    const [existingImageUrl, setExistingImageUrl] = useState("");
    const [existingImageId, setExistingImageId] = useState("");

    useEffect(() => {
        // Fetch restaurants
        axios.get(`${API_BASE_URL}/restaurants`)
            .then(res => setRestaurants(res.data));

        // Fetch food item
        axios.get(`${API_BASE_URL}/food/food-items/${id}`)
            .then(res => {
                const item = res.data;
                setSelectedRestaurant(item.restaurant_id);
                setName(item.name);
                setPrice(item.price);
                setMrp(item.mrp);
                setQuantityInfo(item.quantity_info);
                setCategory(item.category);
                setShortDesc(item.short_desc || "");
                setLongDesc(item.long_desc || "");
                setExistingImageUrl(item.image_url);
                setExistingImageId(item.image_id);
            })
            .catch(() => toast.error("Failed to load food item"));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedRestaurant || !name || !price || !mrp || !quantityInfo || !category) {
            return alert("Required Fields Missing.");
        }

        try {
            let image_url = existingImageUrl;
            let image_id = existingImageId;

            // Upload new image only if selected
            if (image) {
                const uploaded = await uploadImageToCloudinary(image);
                image_url = uploaded.secure_url;
                image_id = uploaded.public_id;
            }

            await axios.put(`${API_BASE_URL}/food/food-items/${id}`, {
                restaurant_id: selectedRestaurant,
                name,
                price,
                mrp,
                quantity_info: quantityInfo,
                category,
                short_desc: shortDesc,
                long_desc: longDesc,
                image_url,
                image_id
            });

            toast.success("Food Item Updated!");
            navigate("/food-items");
        } catch (err) {
            console.error(err);
            toast.error("Error Updating Food Item.");
        }
    };

    return (
        <div style={{ margin: "20px 100px" }}>
            <h2>Edit Food Item</h2>

            <form onSubmit={handleSubmit}>
                <select
                    className="form-select mb-2"
                    value={selectedRestaurant}
                    onChange={(e) => setSelectedRestaurant(e.target.value)}
                    required
                >
                    <option disabled value="">Select Restaurant</option>
                    {restaurants.map(r => (
                        <option key={r._id} value={r._id}>{r.name}</option>
                    ))}
                </select>

                <input className="form-control mb-2" value={name}
                    onChange={(e) => setName(e.target.value)} placeholder="Food Name" required />

                <input className="form-control mb-2" type="number" value={price}
                    onChange={(e) => setPrice(e.target.value)} placeholder="Price" required />

                <input className="form-control mb-2" type="number" value={mrp}
                    onChange={(e) => setMrp(e.target.value)} placeholder="MRP" required />

                <input className="form-control mb-2" value={quantityInfo}
                    onChange={(e) => setQuantityInfo(e.target.value)} placeholder="Quantity Info" required />

                <input className="form-control mb-2" value={category}
                    onChange={(e) => setCategory(e.target.value)} placeholder="Category" required />

                <input className="form-control mb-2" value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)} placeholder="Short Description" />

                <input className="form-control mb-2" value={longDesc}
                    onChange={(e) => setLongDesc(e.target.value)} placeholder="Long Description" />

                {existingImageUrl && (
                    <div className="mb-2">
                        <img src={existingImageUrl} alt="Food"
                            style={{ width: "120px", borderRadius: "8px" }} />
                    </div>
                )}

                <input
                    className="form-control mb-3"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />

                <button className="btn btn-warning" type="submit">
                    Update Food Item
                </button>
            </form>
        </div>
    );
}
