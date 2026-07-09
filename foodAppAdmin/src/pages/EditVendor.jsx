import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EditVendor() {

    const { id } = useParams();

    const [areas, setAreas] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        password: "",
        area_id: "",
        status: true,
    });

    useEffect(() => {

        const load = async () => {

            const [vendor, areas] = await Promise.all([
                axios.get(`${API_BASE_URL}/vendor/${id}`),
                axios.get(`${API_BASE_URL}/area/all`)
            ]);

            setAreas(areas.data);

            setFormData({
                name: vendor.data.name,
                phone: vendor.data.phone,
                password: "",
                area_id: vendor.data.area_id._id,
                status: vendor.data.status,
            });

        };

        load();

    }, [id]);

    const handleChange = (e) => {

        const { name, value, checked, type } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

    };

    const submit = async (e) => {

        e.preventDefault();

        await axios.put(
            `${API_BASE_URL}/vendor/${id}`,
            formData
        );

        alert("Vendor Updated");

    };

    return (
        <div className="container mt-4">

            <h3>Edit Vendor</h3>

            <form onSubmit={submit}>

                <input
                    className="form-control mb-2"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-2"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                />

                <input
                    className="form-control mb-2"
                    placeholder="Leave blank to keep password"
                    type="text"
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
                    {areas.map((area) => (
                        <option key={area._id} value={area._id}>
                            {area.name}
                        </option>
                    ))}
                </select>

                <label className="mb-3">

                    <input
                        type="checkbox"
                        checked={formData.status}
                        name="status"
                        onChange={handleChange}
                    />

                    {" "}Active

                </label>

                <br />

                <button className="btn btn-success">
                    Update
                </button>

            </form>

        </div>
    );
}