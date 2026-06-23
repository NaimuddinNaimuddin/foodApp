import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/Orders.css';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE_URL}/orders/all`)
            .then((res) => {
                if (res.status == 200) {
                    setOrders(res.data);
                }
                if (res.status == 404) {
                    alert('No Orders Found.')
                }
            })
            .catch(() => alert("Order fetch Error."))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const eventSource = new EventSource(`${API_BASE_URL}/orders/stream`);
        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === "new_order") {
                setOrders((prev) => [data.order, ...prev]);
            }
        };
    }, [])

    return (
        <div>
            {loading && 'Loading...'}
            <div className="orders-container">
                {orders.map((order) => (
                    <div className="order-card" key={order._id}>
                        <div className="order-header">
                            <h4>Order #{order._id}</h4>
                            <span className={`status ${order.status.toLowerCase()}`}>
                                {order.status}
                            </span>
                        </div>

                        <p className="amount">
                            Total: ₹{order.totalAmount}
                        </p>

                        <div className="items-list">
                            {order.items.map((item) => (
                                <div className="item-card" key={item._id}>
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                    />

                                    <div>
                                        <h5>{item.name}</h5>
                                        <p>Qty: {item.quantity}</p>
                                        <p>₹{item.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
