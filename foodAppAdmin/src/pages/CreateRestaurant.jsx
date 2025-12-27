import React, { useState } from "react";
import axios from "axios";
import GetCurrentLocation from "../components/GetCurrentLocation";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const YOUR_UPLOAD_PRESET = import.meta.env.VITE_YOUR_UPLOAD_PRESET;

export default function CreateRestaurant() {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [address, setAddress] = useState(null);
    const [status, setStatus] = useState(null);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);

    const uploadImageToCloudinary = async () => {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", YOUR_UPLOAD_PRESET);

        const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            formData
        );

        return res.data.secure_url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) return alert("Please select an image");
        if (!location) return alert("Please select location");
        try {
            setLoading(true);

            // 1. Upload image
            const imageUrl = await uploadImageToCloudinary();

            // 2. Save restaurant
            await axios.post(`${API_BASE_URL}/restaurants`, {
                name,
                image_url: imageUrl,
                latitude: location.lat,
                longitude: location.lng,
            });

            alert("Restaurant created!");
            setName("");
            setImage(null);
        } catch (err) {
            console.error(err);
            alert("Error creating restaurant");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "60%", margin: "auto" }}>
            <h2>Create Restaurant</h2>

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
                    onChange={(e) => setImage(e.target.files[0])}
                />

                <h4>Select Location</h4>
                <GetCurrentLocation onLocationSelect={setLocation} />

                <button className="btn btn-info mb-2" type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Create"}
                </button>
            </form>
        </div>
    );
}
