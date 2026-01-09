import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import CreateRestaurant from "./pages/CreateRestaurant";
import AddFoodItems from "./pages/AddFoodItems";
import EditFoodItems from "./pages/EditFoodItems";
import FoodScreen from "./pages/FoodScreen";
import SideNav from "./components/SideNav";
import Food from "./components/Food";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <ToastContainer />
      <div style={{ display: 'flex' }}>
        <div style={{ width: '20%', background: '#eee' }}>
          <SideNav />
        </div>
        <div style={{ width: '80%' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/foods" element={<FoodScreen />} />
            <Route path="/restaurant/:id" element={<Food />} />
            <Route path="/create" element={<CreateRestaurant />} />
            <Route path="/add-food" element={<AddFoodItems />} />
            <Route path="/food/edit/:id" element={<EditFoodItems />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
