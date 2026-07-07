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
                    console.log(res.data);
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
            <div className="orders-container">
                {areas && areas.length > 0 && areas.map((area) => (
                    <div className="order-card" key={area._id}>
                        <p className="amount">
                            {area?.name} - {area?.code} -
                            <span style={{ border: '1px solid #eee' }}>
                                {area?.status ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                        </p>
                        <p className="amount">
                            Delivery Charges (in Rs) - {area?.delivery_charge_in_rs}
                        </p>
                        <p className="amount">
                            Delivery Text - {area?.delivery_text}
                        </p>
                        <button onClick={() => navigate(`/areas/edit/${area._id}`)} className="btn btn-warning">
                            EDIT
                        </button>

                    </div>
                ))}
            </div>
        </div>
    );
};
