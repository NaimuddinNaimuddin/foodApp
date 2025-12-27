import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreateRestaurant from "./pages/CreateRestaurant";
import AddFoodItems from "./pages/AddFoodItems";

export default function App() {
  return (
    <>
      <nav style={{ padding: 10 }}>
        <Link to="/">Home</Link> |{" "}
        <Link to="/create">Create Restaurant</Link> |{" "}
        <Link to="/add-food">Add Food</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateRestaurant />} />
        <Route path="/add-food" element={<AddFoodItems />} />
      </Routes>
    </>
  );
}
