import { useState, useEffect } from "react";
import axios from "axios";
import { uploadImageToCloudinary } from "../services/imageUpload";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AddFoodItem() {
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState([]);

  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(undefined);
  const [mrp, setMrp] = useState(undefined);
  const [quantityInfo, setQuantityInfo] = useState("");
  const [category, setCategory] = useState("");
  const [sort_order, setsort_order] = useState(0);
  const [stock_order, setstock_order] = useState(0);
  const [status, setstatus] = useState(true);
  const [in_stock, setin_stock] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/admin/restaurants`)
      .then((res) => setRestaurants(res.data))
      .catch((err) => toast.error('Restaurant Fetch Err.'));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(price) > Number(mrp)) return toast.error("Price should less than MRP.");
    if (!selectedRestaurant || !name || !price || !mrp || !quantityInfo || !category) return toast.error("Required Fields Missing.");
    try {
      setLoading(true);
      const { secure_url, public_id } = await uploadImageToCloudinary(image);
      await axios.post(`${API_BASE_URL}/admin/food/food-items`, {
        restaurant_id: selectedRestaurant,
        name,
        price,
        mrp,
        quantity_info: quantityInfo,
        category,
        stock_order,
        sort_order,
        status,
        in_stock,
        image_url: secure_url,
        image_id: public_id,
      });
      toast.success("Food Item Added!");
    } catch (err) {
      toast.error("Error Adding Food Item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ margin: "20px 100px" }}>
      <h2>Add Food Item</h2>
      <form onSubmit={handleSubmit}>
        <select
          className="form-select mb-2"
          required
          value={selectedRestaurant}
          onChange={(e) => setSelectedRestaurant(e.target.value)}
        >
          <option disabled value="">Select Restaurant</option>
          {restaurants.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name}
            </option>
          ))}
        </select>
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Food Name"
          value={name}
          maxLength={30}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          type="number"
          placeholder="Price"
          value={price}
          maxLength={10}
          onChange={(e) => setPrice(e.target.value.slice(0, 6))}
          required
        />
        <input
          className="form-control mb-2"
          type="number"
          placeholder="MRP"
          value={mrp}
          onChange={(e) => setMrp(e.target.value.slice(0, 6))}
          required
        />
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Quantity Info"
          value={quantityInfo}
          maxLength={30}
          onChange={(e) => setQuantityInfo(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Category"
          value={category}
          maxLength={15}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          type="number"
          placeholder="Sort Order"
          value={sort_order}
          onChange={(e) => setsort_order(e.target.value.slice(0, 4))}
        />
        <input
          className="form-control mb-2"
          type="number"
          placeholder="Stock Order"
          value={stock_order}
          onChange={(e) => setstock_order(e.target.value.slice(0, 4))}
        />
        <div className="mb-2">
          <label>
            <input
              type="checkbox"
              checked={in_stock}
              onChange={(e) => setin_stock(e.target.checked)}
            />
            {" "} In Stock
          </label>
        </div>
        <div className="mb-2">
          <label>
            <input
              type="checkbox"
              checked={status}
              onChange={(e) => setstatus(e.target.checked)}
            />
            {" "}Active
          </label>
        </div>
        <input
          className="form-control mb-2"
          type="file"
          required
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button disabled={loading} className="btn btn-info" type="submit">
          {loading ? "Adding..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
