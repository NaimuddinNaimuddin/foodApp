import { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CreateArea() {
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [delivery_charge_in_rs, setdelivery_charge_in_rs] = useState(null);
    const [delivery_text, setdelivery_text] = useState("");
    const [status, setstatus] = useState(true);

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!code) return alert("Please select Code");
        if (!name) return alert("Please select Name");
        try {
            setLoading(true);

            await axios.post(`${API_BASE_URL}/admin/area/add`, {
                name,
                code,
                delivery_charge_in_rs,
                delivery_text,
                status
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
                    onChange={(e) => setCode(e.target.value.slice(0, 8))}
                    required
                />
                <input
                    className="form-control mb-2"
                    type="text"
                    placeholder="Delivery Text"
                    value={delivery_text}
                    onChange={(e) => setdelivery_text(e.target.value)}
                />
                <input
                    className="form-control mb-2"
                    type="number"
                    placeholder="Delivery Charges (in Rs)"
                    value={delivery_charge_in_rs}
                    onChange={(e) => setdelivery_charge_in_rs(e.target.value)}
                />
                <label className="d-block">
                    <input
                        type="checkbox"
                        checked={status}
                        onChange={(e) => setstatus(e.target.value)}
                    />
                    Active
                </label>

                <button className="btn btn-info mb-2 mt-2" type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Create"}
                </button>
            </form>
        </div>
    );
}
