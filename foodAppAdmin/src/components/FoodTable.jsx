import React from "react";
import { useNavigate } from "react-router-dom";

const FoodTable = ({ foods }) => {
    const navigate = useNavigate();

    return (
        <div className="table-responsive">
            <table
                className="table table-bordered table-hover table-striped align-middle"
            >
                <thead>
                    <tr style={{ background: "#f5f5f5" }}>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>MRP</th>
                        <th>Quantity</th>
                        <th>In Stock</th>
                        <th>Status</th>
                        <th>Sort Order</th>
                        <th>Stock Order</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {foods && foods.length > 0 && foods.map((item, index) => (
                        <tr key={item._id}>
                            <td>
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    width="60"
                                    height="60"
                                    style={{
                                        objectFit: "cover",
                                        borderRadius: "6px",
                                    }}
                                />
                            </td>

                            <td>{item.name}</td>

                            <td>{item.category}</td>

                            <td>₹{item.price}</td>

                            <td>₹{item.mrp}</td>

                            <td>{item.quantity_info}</td>

                            <td>
                                {item.in_stock ? (
                                    <span style={{ color: "green" }}>Yes</span>
                                ) : (
                                    <span style={{ color: "red" }}>No</span>
                                )}
                            </td>

                            <td>
                                {item.status ? (
                                    <span style={{ color: "green" }}>Active</span>
                                ) : (
                                    <span style={{ color: "red" }}>Inactive</span>
                                )}
                            </td>

                            <td>{item.sort_order}</td>
                            <td>{item.stock_order}</td>
                            <td>
                                <button
                                    className="addBtn"
                                    onClick={() => {
                                        navigate(`/food/edit/${item._id}`); s
                                    }}
                                >
                                    EDIT
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    );
};

export default FoodTable;