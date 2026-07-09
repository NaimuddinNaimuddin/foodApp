import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function CreateVendor() {
    const [areas, setAreas] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        password: "",
        area_id: "",
        status: true,
    });

    useEffect(() => {
        axios
            .get(`${API_BASE_URL}/area/all`)
            .then((res) => setAreas(res.data));
    }, []);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const submit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/vendor`, formData);
            alert("Vendor Created");
        } catch (err) {
            alert(err?.response?.data?.message || 'Create Vendor Error.')
        }
    };

    return (
        <div className="container mt-4">

            <h3>Create Vendor</h3>

            <form onSubmit={submit}>

                <input
                    className="form-control mb-2"
                    placeholder="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-2"
                    placeholder="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-2"
                    placeholder="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <select
                    className="form-control mb-2"
                    name="area_id"
                    value={formData.area_id}
                    onChange={handleChange}
                >
                    <option value="">Select Area</option>

                    {areas.map((area) => (
                        <option key={area._id} value={area._id}>
                            {area.name}
                        </option>
                    ))}
                </select>

                <label className="mb-3">
                    <input
                        type="checkbox"
                        name="status"
                        checked={formData.status}
                        onChange={handleChange}
                    />

                    {" "}Active
                </label>

                <br />

                <button className="btn btn-primary">
                    Create
                </button>

            </form>

        </div>
    );
}