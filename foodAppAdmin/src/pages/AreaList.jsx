import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/Orders.css';
import { useNavigate } from "react-router-dom";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Areas() {
    const navigate = useNavigate();
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE_URL}/admin/area/all`)
            .then((res) => {
                if (res.status == 200) {
                    setAreas(res.data);
                }
            })
            .catch(() => alert("Areas Fetch Error or No Area Found"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            {loading && 'Loading...'}
            <div style={{ display: 'flex', marginBottom: '20px', justifyContent: 'end' }}>
                <button
                    onClick={() => navigate('/areas/add')}
                    className="addBtn">ADD Area</button>
            </div>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Status</th>
                        <th>Delivery Charges (in Rs)</th>
                        <th>Delivery Text</th>
                        <th width="180">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {areas && areas.length > 0 && areas.map((area) => (
                        <tr key={area._id}>
                            <td>
                                {area?.name}
                            </td>
                            <td>
                                {area?.code}
                            </td>
                            <td>
                                {area?.status ? 'ACTIVE' : 'INACTIVE'}
                            </td>
                            <td>
                                {area?.delivery_charge_in_rs}
                            </td>
                            <td>
                                {area?.delivery_text}
                            </td>
                            <td>
                                <button onClick={() => navigate(`/areas/edit/${area._id}`)} className="btn btn-warning">
                                    EDIT
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
