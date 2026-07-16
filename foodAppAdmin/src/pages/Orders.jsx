import { useEffect, useState } from "react";
import axios from "axios";
import '../styles/Orders.css';
import OrdersTable from "../components/OrderTable";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_BASE_URL}/admin/orders/all`)
            .then((res) => {
                if (res.status == 200) {
                    setOrders(res.data);
                }
            })
            .catch(() => toast.error("Order Fetch Error."))
            .finally(() => setLoading(false));
    }, []);

    // useEffect(() => {
    //     const eventSource = new EventSource(`${API_BASE_URL}/orders/stream`);
    //     eventSource.onmessage = (event) => {
    //         const data = JSON.parse(event.data);

    //         if (data.type === "new_order") {
    //             setOrders((prev) => [data.order, ...prev]);
    //         }
    //     };
    // }, [])

    return (
        <div className="container-fluid mt-4">
            {loading && 'Loading...'}
            <OrdersTable orders={orders} />
        </div>
    );
};
