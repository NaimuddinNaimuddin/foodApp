import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const YOUR_UPLOAD_PRESET = import.meta.env.VITE_YOUR_UPLOAD_PRESET;

const initialFormState = {
    name: "",
    category: null,
    area_id: null,
    is_banner: false,
    sort_order: 0,
    status: true,
};

export default function EditRestaurant() {
    const { id } = useParams();
    const [formData, setFormData] = useState(initialFormState);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);
    const [existingImage, setExistingImage] = useState(null);

    // Load areas + restaurant data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [areasRes, restaurantRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/admin/area/all`),
                    axios.get(`${API_BASE_URL}/admin/restaurants/${id}`)
                ]);

                setAreas(areasRes.data);

                const r = restaurantRes.data;

                setFormData({
                    name: r.name || "",
                    category: r.category || null,
                    area_id: r.area_id || null,
                    is_banner: r.is_banner || false,
                    sort_order: r.sort_order || 0,
                    status: r.status ?? true,
                });

                setExistingImage(r.image_url || null);
            } catch (err) {
                console.error("Failed to load data:", err);
                setError("Failed to load restaurant data");
            }
        };

        if (id) fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const uploadImageToCloudinary = async (file) => {
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("upload_preset", YOUR_UPLOAD_PRESET);

        const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            uploadData
        );

        return {
            url: res.data.secure_url,
            publicId: res.data.public_id,
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMsg(null);

        try {
            setLoading(true);

            let imageUrl = existingImage;
            let imageId = null;

            // Upload new image only if selected
            if (imageFile) {
                const upload = await uploadImageToCloudinary(imageFile);
                imageUrl = upload.url;
                imageId = upload.publicId;
            }

            await axios.put(
                `${API_BASE_URL}/admin/restaurants/${id}`,
                {
                    name: formData.name,
                    category: formData.category,
                    image_url: imageUrl,
                    image_id: imageId,
                    area_id: formData.area_id,
                    is_banner: formData.is_banner,
                    sort_order: Number(formData.sort_order),
                    status: formData.status,
                }
            );

            setSuccessMsg("Restaurant updated successfully!");
            setImageFile(null);
        } catch (err) {
            console.error(err);
            setError(err?.response?.data?.message || "Error updating restaurant.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ margin: "20px 100px", maxWidth: 500 }}>
            <h2>Edit Restaurant</h2>

            {error && <p style={{ color: "#e74c3c" }}>{error}</p>}
            {successMsg && <p style={{ color: "#2ecc71" }}>{successMsg}</p>}

            <form onSubmit={handleSubmit}>
                <input
                    className="form-control mb-2"
                    type="text"
                    name="name"
                    placeholder="Restaurant Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    className="form-control mb-2"
                    type="text"
                    name="category"
                    placeholder="Restaurant Category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />

                <select
                    className="form-control mb-2"
                    name="area_id"
                    value={formData.area_id}
                    onChange={handleChange}
                >
                    <option value="">Global (all areas)</option>
                    {areas.map((area) => (
                        <option key={area._id} value={area._id}>
                            {area.name} ({area.code})
                        </option>
                    ))}
                </select>

                <input
                    className="form-control mb-2"
                    type="number"
                    name="sort_order"
                    value={formData.sort_order}
                    onChange={handleChange}
                />

                <div className="mb-2">
                    <label>
                        <input
                            type="checkbox"
                            name="is_banner"
                            checked={formData.is_banner}
                            onChange={handleChange}
                        />
                        {" "}Show as Banner
                    </label>
                </div>

                <div className="mb-2">
                    <label>
                        <input
                            type="checkbox"
                            name="status"
                            checked={formData.status}
                            onChange={handleChange}
                        />
                        {" "}Active
                    </label>
                </div>

                {/* Existing image */}
                {existingImage && (
                    <img
                        src={existingImage}
                        alt="Current"
                        style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8, marginBottom: 10 }}
                    />
                )}
                {/* New preview */}
                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="New Preview"
                        style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8, marginBottom: 10 }}
                    />
                )}

                <input
                    className="form-control mb-2"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />

                <button className="btn btn-warning mb-2" type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update"}
                </button>
            </form>
        </div>
    );
}