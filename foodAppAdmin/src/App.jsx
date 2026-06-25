import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import CreateRestaurant from "./pages/CreateRestaurant";
import EditRestaurant from "./pages/EditRestaurants";
import AddFoodItems from "./pages/AddFoodItems";
import EditFoodItems from "./pages/EditFoodItems";
import Restaurants from "./pages/Restaurants";
import Orders from "./pages/Orders";

import SideNav from "./components/SideNav";
import Food from "./components/Food";
import "react-toastify/dist/ReactToastify.css";
import CreateArea from "./pages/AddArea";
import AreaList from "./pages/AreaList";

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
            <Route path="/orders" element={<Orders />} />
            <Route path="/areas/add" element={<CreateArea />} />
            <Route path="/areas/list" element={<AreaList />} />

            <Route path="/restaurants" element={<Restaurants />} />
            <Route path="/restaurant/add" element={<CreateRestaurant />} />
            <Route path="/restaurant/edit/:id" element={<EditRestaurant />} />

            <Route path="/restaurant/:id" element={<Food />} />
            <Route path="/food/add" element={<AddFoodItems />} />
            <Route path="/food/edit/:id" element={<EditFoodItems />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
