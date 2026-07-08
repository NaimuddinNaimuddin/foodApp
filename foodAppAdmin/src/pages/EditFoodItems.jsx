import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { uploadImageToCloudinary } from "../services/imageUpload";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditFoodItem() {
    const { id } = useParams();

    const [loading, setLoading] = useState(false);
    const [restaurants, setRestaurants] = useState([]);

    const [selectedRestaurant, setSelectedRestaurant] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState(undefined);
    const [mrp, setMrp] = useState(undefined);
    const [quantityInfo, setQuantityInfo] = useState("");
    const [category, setCategory] = useState("");
    const [sort_order, setsort_order] = useState(0);
    const [stock_order, setstock_order] = useState(0);
    const [status, setstatus] = useState(true);
    const [in_stock, setin_stock] = useState(false);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [existingImageUrl, setExistingImageUrl] = useState("");
    const [existingImageId, setExistingImageId] = useState("");

    useEffect(() => {
        setLoading(true);
        // Fetch restaurants
        axios.get(`${API_BASE_URL}/admin/restaurants`)
            .then(res => setRestaurants(res.data))
            .catch(() => toast.error("Failed to load restaurants."));

        // Fetch food item
        axios.get(`${API_BASE_URL}/admin/food/food-items/${id}`)
            .then(res => {
                const item = res.data;
                setSelectedRestaurant(item.restaurant_id);
                setName(item.name);
                setPrice(item.price);
                setMrp(item.mrp);
                setQuantityInfo(item.quantity_info);
                setCategory(item.category);
                setstock_order(item.stock_order);
                setsort_order(item.sort_order);
                setstatus(item.status);
                setin_stock(item.in_stock);
                setExistingImageUrl(item.image_url);
                setExistingImageId(item.image_id);
            })
            .catch(() => toast.error("Failed to load food item"))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Number(price) > Number(mrp)) return alert("Price should less than MRP.");
        if (!id || !selectedRestaurant || !name || !price || !mrp || !quantityInfo || !category) {
            return alert("Required Fields Missing.");
        }

        try {
            setLoading(true);
            let image_url = existingImageUrl;
            let image_id = existingImageId;

            // Upload new image only if selected
            if (image) {
                const uploaded = await uploadImageToCloudinary(image);
                image_url = uploaded.secure_url;
                image_id = uploaded.public_id;
            }

            await axios.put(`${API_BASE_URL}/admin/food/food-items/${id}`, {
                restaurant_id: selectedRestaurant,
                name,
                price,
                mrp,
                quantity_info: quantityInfo,
                category,
                stock_order,
                sort_order,
                status,
                in_stock,
                image_url,
                image_id
            });
            toast.success("Food Item Updated!");
        } catch (err) {
            toast.error("Error Updating Food Item.");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImage(file);
        setImagePreview(URL.createObjectURL(file));
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
                <input
                    className="form-control mb-2"
                    type="number"
                    placeholder="Sort Order"
                    value={sort_order}
                    onChange={(e) => setsort_order(e.target.value.slice(0, 4))}
                />
                <input
                    className="form-control mb-2"
                    type="number"
                    placeholder="Stock Order"
                    value={stock_order}
                    onChange={(e) => setstock_order(e.target.value.slice(0, 4))}
                />
                <div className="mb-2">
                    <label>
                        <input
                            type="checkbox"
                            checked={in_stock}
                            onChange={(e) => setin_stock(e.target.checked)}
                        />
                        {" "} In Stock
                    </label>
                </div>
                <div className="mb-2">
                    <label>
                        <input
                            type="checkbox"
                            checked={status}
                            onChange={(e) => setstatus(e.target.checked)}
                        />
                        {" "}Active
                    </label>
                </div>

                <div className="d-flex">
                    {existingImageUrl && (
                        <div className="mb-2">
                            <img src={existingImageUrl} alt="Food"
                                style={{ width: "120px", borderRadius: "8px" }} />
                        </div>
                    )}

                    {imagePreview && (
                        <div className="mb-3">
                            <img
                                src={imagePreview}
                                alt="Preview"
                                style={{
                                    width: "120px",
                                    objectFit: "cover",
                                    borderRadius: "8px",
                                    border: "1px solid #ddd",
                                }}
                            />
                        </div>
                    )}
                </div>
                <input
                    type="file"
                    className="form-control mb-2"
                    accept="image/*"
                    onChange={handleImageChange}
                />

                <button disabled={loading} className="btn btn-warning" type="submit">
                    {loading ? (<>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Updating...
                    </>) : ("Update Food Item")}
                </button>

            </form>
        </div>
    );
}
