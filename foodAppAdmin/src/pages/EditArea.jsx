
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditArea() {
    const { id } = useParams();
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [delivery_charge_in_rs, setdelivery_charge_in_rs] = useState(null);
    const [delivery_text, setdelivery_text] = useState("");
    const [status, setstatus] = useState(true);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get(`${API_BASE_URL}/admin/areabyId/${id}`)
            .then((res) => {
                if (res && res.data && res.data.code) {
                    setName(res.data.name);
                    setCode(res.data.code);
                    setdelivery_charge_in_rs(res.data.delivery_charge_in_rs);
                    setdelivery_text(res.data.delivery_text);
                    setstatus(res.data.status);
                }
            })
            .catch((err) => alert(err.message || "Fect Area By Id Error."))
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!code) return alert("Please select Code");
        if (!name) return alert("Please select Name");
        try {
            setLoading(true);

            await axios.put(`${API_BASE_URL}/admin/area/edit/${id}`, {
                name,
                code,
                delivery_charge_in_rs,
                delivery_text,
                status
            });

            alert("Area Edited!");
        } catch (err) {
            alert("Error Edit Area");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ margin: "20px 100px" }}>
            <h2>Edit Area</h2>

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
                        onChange={(e) => setstatus(e.target.checked)}
                    />
                    Active
                </label>

                <button className="btn btn-info mb-2 mt-2" type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Edit"}
                </button>
            </form>
        </div>
    );
}
