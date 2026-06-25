import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/Orders.css';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Areas() {
    const [areas, setAreas] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE_URL}/area/all`)
            .then((res) => {
                if (res.status == 200) {
                    setAreas(res.data);
                    console.log(res.data);
                }
                if (res.status == 404) {
                    alert('No Areas Found.')
                }
            })
            .catch(() => alert("Areas fetch Error."))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            {loading && 'Loading...'}
            <div className="orders-container">
                {areas.map((area) => (
                    <div className="order-card" key={area._id}>
                        <div className="order-header">
                            <span>
                                {area.status}
                            </span>
                        </div>

                        <p className="amount">
                            {area.name}
                        </p>
                        <p className="amount">
                            {area.code}
                        </p>

                    </div>
                ))}
            </div>
        </div>
    );
};
