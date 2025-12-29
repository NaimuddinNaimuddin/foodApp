import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AddFoodItem() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    axios.get(`${API_BASE_URL}/restaurants`).then((res) => setRestaurants(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRestaurant) return alert("Select a restaurant");

    try {
      await axios.post(`${API_BASE_URL}/restaurants/food-items`, {
        name,
        price,
        image,
        category,
        restaurantId: selectedRestaurant,
      });

      alert("Food item added!");
      setName("");
      setPrice("");
      setImage("");
    } catch (err) {
      console.error(err);
      alert("Error adding food item");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>Add Food Item</h2>
      <form onSubmit={handleSubmit}>
        <select
          className="form-select mb-2"
          value={selectedRestaurant}
          onChange={(e) => setSelectedRestaurant(e.target.value)}
        >
          <option>Select Restaurant</option>
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
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Food Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Image URL (optional)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <button className="btn btn-info" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
