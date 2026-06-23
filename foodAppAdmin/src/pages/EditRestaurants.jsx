import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import GetCurrentLocation from "../components/GetCurrentLocation";
import { uploadImageToCloudinary } from "../services/imageUpload";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditRestaurant() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [address, setAddress] = useState("");
    const [status, setStatus] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [imageId, setImageId] = useState(""); // ✅ Track image_id
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);

    // 🔹 Fetch restaurant details
    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE_URL}/restaurants/${id}`)
            .then(res => {
                const r = res.data;
                setName(r.name);
                setCategory(r.category);
                setAddress(r.address);
                setStatus(r.status);
                setImagePreview(r.image_url);
                setImageId(r.image_id); // ✅ Set existing image_id
                setLocation({
                    lat: r.latitude,
                    lng: r.longitude
                });
            })
            .catch(() => alert("Failed to load restaurant"))
            .finally(() => setLoading(false));
    }, [id]);

    // 🔹 Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    // 🔹 Submit update
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        try {
            setLoading(true);

            let updatedImageUrl = imagePreview;
            let updatedImageId = imageId;

            // ✅ Upload new image if changed
            if (image) {
                const { secure_url, public_id } = await uploadImageToCloudinary(image);
                updatedImageUrl = secure_url;
                updatedImageId = public_id;
            }

            await axios.put(`${API_BASE_URL}/restaurants/edit/${id}`, {
                name,
                category,
                address,
                status,
                image_url: updatedImageUrl,
                image_id: updatedImageId,
                latitude: location?.lat,
                longitude: location?.lng,
            });

            toast.success("Restaurant updated!");
            navigate("/restaurants");

        } catch (err) {
            console.error(err);
            toast.error("Error updating restaurant");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ margin: "20px 100px" }}>
            <h2>Edit Restaurant</h2>

            <form onSubmit={handleSubmit}>
                <input
                    className="form-control mb-2"
                    type="text"
                    placeholder="Restaurant Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <input
                    className="form-control mb-2"
                    type="text"
                    placeholder="Restaurant Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                />

                <input
                    className="form-control mb-2"
                    type="text"
                    placeholder="Restaurant Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />

                <input
                    className="form-control mb-2"
                    type="text"
                    placeholder="Restaurant Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    required
                />

                <input
                    className="form-control mb-2"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                />

                {imagePreview && (
                    <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                            width: "140px",
                            height: "140px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            marginBottom: "10px"
                        }}
                    />
                )}

                <h4>Select Location</h4>
                <GetCurrentLocation onLocationSelect={setLocation} />

                <button
                    className="btn btn-warning mt-2"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Updating..." : "Update Restaurant"}
                </button>
            </form>
        </div>
    );
}
