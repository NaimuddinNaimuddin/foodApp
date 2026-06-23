import { useEffect } from "react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Orders() {

    useEffect(() => {
        const eventSource = new EventSource(`${API_BASE_URL}/orders/stream`);
        eventSource.onmessage = (event) => {
            const order = JSON.parse(event.data);
            console.log('order', order);
        };
    }, []);

    return (
        <div>
            this is page
        </div>
    );
};
