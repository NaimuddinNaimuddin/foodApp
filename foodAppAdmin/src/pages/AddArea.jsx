import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CreateArea() {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!code) return alert("Please select Code");
        if (!name) return alert("Please select Name");
        try {
            setLoading(true);

            await axios.post(`${API_BASE_URL}/area/add`, {
                name,
                code,
            });

            alert("Area created!");
            setName("");
            setCode("");
        } catch (err) {
            console.error(err);
            alert("Error creating Area");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ margin: "20px 100px" }}>
            <h2>Create Area</h2>

            <form onSubmit={handleSubmit}>
                <input
                    className="form-control mb-2"
                    type="text"
                    placeholder="Area Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    className="form-control mb-2"
                    type="number"
                    placeholder="Area Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
                <button className="btn btn-info mb-2" type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Create"}
                </button>
            </form>
        </div>
    );
}
