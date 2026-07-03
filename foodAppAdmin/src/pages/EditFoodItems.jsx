import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { uploadImageToCloudinary } from "../services/imageUpload";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditFoodItem() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [areaCode, setAreaCode] = useState("");
    const [areas, setAreas] = useState([]);
    console.log(areas);
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
    const [imagePreview, setImagePreview] = useState("");

    const [existingImageUrl, setExistingImageUrl] = useState("");
    const [existingImageId, setExistingImageId] = useState("");

    useEffect(() => {
        axios.get(`${API_BASE_URL}/admin/area/all`).then((res) => setAreas(res.data));
    }, []);

    useEffect(() => {
        setLoading(true);
        // Fetch restaurants
        axios.get(`${API_BASE_URL}/admin/restaurants`)
            .then(res => setRestaurants(res.data));

        // Fetch food item
        axios.get(`${API_BASE_URL}/admin/food/food-items/${id}`)
            .then(res => {
                const item = res.data;
                setSelectedRestaurant(item.restaurant_id);
                setName(item.name);
                setPrice(item.price);
                setAreaCode(item.area_id);
                setMrp(item.mrp);
                setQuantityInfo(item.quantity_info);
                setCategory(item.category);
                setShortDesc(item.short_desc || "");
                setLongDesc(item.long_desc || "");
                setExistingImageUrl(item.image_url);
                setExistingImageId(item.image_id);
            })
            .catch(() => toast.error("Failed to load food item"))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedRestaurant || !name || !price || !mrp || !quantityInfo || !category) {
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
                area_id: areaCode,
                quantity_info: quantityInfo,
                category,
                short_desc: shortDesc,
                long_desc: longDesc,
                image_url,
                image_id
            });
            setLoading(false);
            toast.success("Food Item Updated!");
        } catch (err) {
            setLoading(false);
            console.error(err);
            toast.error("Error Updating Food Item.");
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
                <select
                    className="form-control mb-2"
                    value={areaCode}
                    onChange={(e) => setAreaCode(e.target.value)}
                >
                    <option value="">Select Location</option>
                    {areas.length > 0 && areas.map((area) => {
                        return <option value={area._id}>{area.name} - {area.code}</option>
                    })}
                </select>
                <input className="form-control mb-2" value={shortDesc}
                    onChange={(e) => setShortDesc(e.target.value)} placeholder="Short Description" />

                <input className="form-control mb-2" value={longDesc}
                    onChange={(e) => setLongDesc(e.target.value)} placeholder="Long Description" />

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
