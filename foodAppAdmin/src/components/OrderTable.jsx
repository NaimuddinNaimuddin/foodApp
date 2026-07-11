import React, { useState } from "react";

const OrdersTable = ({ orders }) => {
    const [expandedOrder, setExpandedOrder] = useState(null);

    const getStatusBadge = (status) => {
        switch (status) {
            case "Pending":
                return "warning";
            case "Confirmed":
                return "primary";
            case "Preparing":
                return "info";
            case "Delivered":
                return "success";
            case "Cancelled":
                return "danger";
            default:
                return "secondary";
        }
    };

    return (
        <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle mb-0">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Customer</th>
                        <th>Area</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Order Date</th>
                        <th width="120">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders && orders.length > 0 &&
                        orders.map((order, index) => (
                            <React.Fragment key={order._id}>
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>
                                        <strong>{order.userId}</strong>
                                    </td>
                                    <td>{order.areaId}</td>
                                    <td>{order.items.length}</td>
                                    <td>₹{order.totalAmount}</td>
                                    <td>{order.paymentMethod}</td>
                                    <td>
                                        <span className={`badge bg-${getStatusBadge(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>
                                        {new Date(order.createdAt).toLocaleString()}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}>
                                            {expandedOrder === order._id ? "Hide" : "View"}
                                        </button>
                                    </td>
                                </tr>
                                {expandedOrder === order._id && (
                                    <tr>
                                        <td colSpan="9">
                                            <div className="p-3 bg-light">
                                                <h5>Order Items</h5>
                                                <table className="table table-bordered table-striped">
                                                    <thead className="table-secondary">
                                                        <tr>
                                                            <th>Image</th>
                                                            <th>Food</th>
                                                            <th>Quantity</th>
                                                            <th>Price</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {order.items.map((item) => (
                                                            <tr key={item._id}>
                                                                <td>
                                                                    <img
                                                                        src={item.image_url}
                                                                        alt={item.name}
                                                                        width="60"
                                                                        height="60"
                                                                        className="rounded"
                                                                    />
                                                                </td>
                                                                <td>{item.name}</td>
                                                                <td>{item.quantity}</td>
                                                                <td>₹{item.price}</td>
                                                                <td>
                                                                    ₹{item.quantity * item.price}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <div className="mt-3">
                                                    <strong>Delivery Address:</strong>
                                                    <p className="mb-0">
                                                        {order.deliveryAddress}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersTable;