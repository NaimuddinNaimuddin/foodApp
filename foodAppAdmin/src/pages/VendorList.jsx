import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function VendorList() {
    const [vendors, setVendors] = useState([]);

    const loadData = async () => {
        const res = await axios.get(`${API_BASE_URL}/vendor`);
        setVendors(res.data);
    };

    useEffect(() => {
        loadData();
    }, []);

    const deleteVendor = async (id) => {
        if (!window.confirm("Delete vendor?")) return;

        await axios.delete(`${API_BASE_URL}/vendor/${id}`);
        loadData();
    };

    return (
        <div className="container mt-3">
            <div className="d-flex justify-content-between mb-3">
                <h3>Vendors</h3>

                <Link className="btn btn-primary" to="/vendors/create">
                    Add Vendor
                </Link>
            </div>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Area</th>
                        <th>Status</th>
                        <th width="180">Action</th>
                    </tr>
                </thead>

                <tbody>
                    {vendors && vendors.length > 0 && vendors.map((item) => (
                        <tr key={item._id}>
                            <td>{item.name}</td>
                            <td>{item.phone}</td>
                            <td>{item.area_id?.name}</td>
                            <td>{item.status ? "Active" : "Inactive"}</td>

                            <td>
                                <Link
                                    className="btn btn-warning btn-sm me-2"
                                    to={`/vendors/edit/${item._id}`}
                                >
                                    Edit
                                </Link>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteVendor(item._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}