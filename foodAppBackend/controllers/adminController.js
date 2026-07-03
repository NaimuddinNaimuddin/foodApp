const cloudinary = require("../config/cloudinary");
const Area = require("../models/Area");
const Food = require("../models/Food");
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");

const addArea = async (req, res) => {
    const { code, name, status = true } = req.body;

    if (!code || !name) {
        return res.status(400).json({ message: "All Fields Are Required" });
    }

    try {
        const existingCode = await Area.findOne({ code });
        if (existingCode) {
            return res.status(400).json({ message: "Code Already Exists" });
        }

        const newArea = new Area({
            code,
            name,
            status,
        });

        await newArea.save();

        res.status(201).json({ message: "Code Added Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

const addFoodItems = async (req, res) => {
    try {
        const { restaurant_id, area_id, name, price, mrp, quantity_info, category, short_desc, long_desc, image_url, image_id } = req.body;
        console.log({ restaurant_id, name, price, mrp, quantity_info, category, short_desc, long_desc, image_url, image_id, area_id });
        if (!restaurant_id || !name || !price || !mrp || !quantity_info || !category || !area_id) return res.status(400).json({ error: "Bad Request." });

        const foodItem = await Food.create({
            restaurant_id,
            name,
            price,
            mrp,
            quantity_info,
            category,
            short_desc,
            long_desc,
            image_url,
            image_id,
            area_id,
        });

        res.status(201).json(foodItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};

const editFoodItems = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            restaurant_id,
            name,
            price,
            mrp,
            quantity_info,
            category,
            short_desc,
            long_desc,
            area_id,
            image_url,
            image_id,
        } = req.body;

        if (!area_id || !restaurant_id || !name || !price || !mrp || !quantity_info || !category) {
            return res.status(400).json({ error: "Bad Request" });
        }

        const food = await Food.findById(id);
        if (!food) return res.status(404).json({ error: "Food item not found" });

        // Delete old image if replaced
        if (image_id && food.image_id && image_id !== food.image_id) {
            await cloudinary.uploader.destroy(food.image_id);
        }

        food.restaurant_id = restaurant_id;
        food.name = name;
        food.price = price;
        food.mrp = mrp;
        food.quantity_info = quantity_info;
        food.category = category;
        food.short_desc = short_desc;
        food.long_desc = long_desc;
        food.image_url = image_url;
        food.image_id = image_id;
        food.area_id = area_id;

        await food.save();
        res.json(food);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate({
                path: "items.foodId",        // populate foodId first
                populate: { path: "restaurant_id" } // nested populate inside food
            });

        if (!orders || !orders.length) return res.status(404).json({ message: "No orders found" });

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const addRestaurants = async (req, res) => {
    try {
        const { name, image_url, area_code } = req.body;
        console.log({ name, image_url });
        const restaurant = new Restaurant({
            name,
            image_url,
            area_code,
            // location: {
            //   type: "Point",
            //   coordinates: [longitude, latitude]
            // }
        });

        await restaurant.save();
        res.status(201).json(restaurant);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

const addProductToCategory = async (req, res) => {
    try {
        const { name, price, image_url, restaurantId, category, area_code } = req.body;
        console.log({ name, price, image_url, restaurantId, category, area_code });
        if (!restaurantId) return res.status(400).json({ error: "Restaurant ID required" });

        const foodItem = await Food.create({
            name,
            price,
            category,
            image_url,
            area_code,
            restaurant: restaurantId,
        });

        res.status(201).json(foodItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const editCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            category,
            address,
            status,
            image_url,
            image_id,
            area_code,
            // latitude,
            // longitude
        } = req.body;

        // Validation
        if (!name || !category || !address || !status) {
            return res.status(400).json({ error: "Required fields missing" });
        }

        // Find restaurant
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        // Delete old image if replaced
        if (image_url && image_url !== restaurant.image_url) {
            if (restaurant.image_id) {
                await cloudinary.uploader.destroy(restaurant.image_id);
            }
        }

        // Update fields
        restaurant.name = name;
        restaurant.category = category;
        restaurant.address = address;
        restaurant.status = status;
        restaurant.area_code = area_code;
        restaurant.image_url = image_url || restaurant.image_url;
        restaurant.image_id = image_id || restaurant.image_id;
        // restaurant.latitude = latitude || restaurant.latitude;
        // restaurant.longitude = longitude || restaurant.longitude;

        await restaurant.save();

        res.status(200).json({ message: "Restaurant updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}

const getRestaurantById = async (req, res) => {
    const items = await Restaurant.findById(req.params.id);
    res.json(items);
}

const getFoodItemsById = async (req, res) => {
    const item = await Food.findById(req.params.id);
    res.json(item);
}

module.exports = {
    addArea,
    getRestaurantById,
    addRestaurants,
    editCategoryById,
    addProductToCategory,
    getFoodItemsById,
    addFoodItems,
    editFoodItems,
    getAllOrders,
};
