import { useState, useEffect } from "react";
import axios from "axios";
import { uploadImageToCloudinary } from "../services/imageUpload";
import { toast } from "react-toastify";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AddFoodItem() {
  const [restaurants, setRestaurants] = useState([]);

  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [quantityInfo, setQuantityInfo] = useState("");
  const [category, setCategory] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/restaurants`).then((res) => setRestaurants(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRestaurant || !name || !price || !mrp || !quantityInfo || !category) return alert("Required Fields Missing.");

    try {
      const { secure_url, public_id } = await uploadImageToCloudinary(image);
      console.log({
        restaurant_id: selectedRestaurant,
        name,
        price,
        mrp,
        quantity_info: quantityInfo,
        category,
        short_desc: shortDesc,
        long_desc: longDesc,
        image_url: secure_url,
        image_id: public_id
      });
      await axios.post(`${API_BASE_URL}/food/food-items`, {
        restaurant_id: selectedRestaurant,
        name,
        price,
        mrp,
        quantity_info: quantityInfo,
        category,
        short_desc: shortDesc,
        long_desc: longDesc,
        image_url: secure_url,
        image_id: public_id
      });

      toast.success("Food Item Added!")
    } catch (err) {
      console.error(err);
      toast.error("Error Adding Food Item.");
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
          onChange={(e) => setName(e.target.value)}
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
          type="number"
          placeholder="MRP"
          value={mrp}
          onChange={(e) => setMrp(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Quantity Info"
          value={quantityInfo}
          onChange={(e) => setQuantityInfo(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Short Description"
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
        />
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Long Description"
          value={longDesc}
          onChange={(e) => setLongDesc(e.target.value)}
        />
        <input
          className="form-control mb-2"
          type="file"
          required
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button className="btn btn-info" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
