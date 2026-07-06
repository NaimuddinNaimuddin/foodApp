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
    console.log(req.body);
    const { name, image_url, area_id, image_id, category, is_banner = false, sort_order = 0 } = req.body;
    console.log(req.body);
    try {
        const restaurant = new Restaurant({
            name,
            image_id,
            image_url,
            category: category || null,
            area_id: area_id || null,
            is_banner,
            sort_order,
        });

        await restaurant.save();
        res.status(201).json(restaurant);
    } catch (err) {
        // Delete uploaded image if DB save fails
        if (image_id) {
            try {
                await cloudinary.uploader.destroy(image_id);
            } catch (deleteErr) {
                console.error("Failed to delete image:", deleteErr);
            }
        }
        console.log("Err: ", err)
        res.status(500).json({ message: 'Server Error', error: err.message });
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
    const { id } = req.params;
    const {
        name,
        image_id,
        image_url,
        category,
        area_id,
        is_banner,
        sort_order,
        status,
    } = req.body;
    console.log(req.body);

    try {
        if (!id || !name) {
            return res.status(400).json({ error: "Required fields missing" });
        }

        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        const oldImageId = restaurant.image_id;
        let imageChanged = false;

        // Only mark change, DO NOT delete yet
        if (image_url && image_url !== restaurant.image_url) {
            restaurant.image_url = image_url;
            restaurant.image_id = image_id;
            imageChanged = true;
        }

        // Update fields
        restaurant.name = name;
        restaurant.image_id = image_id || restaurant.image_id;
        restaurant.image_url = image_url || restaurant.image_url;
        restaurant.category = category;
        restaurant.area_id = area_id;
        restaurant.is_banner = is_banner;
        restaurant.sort_order = sort_order;
        restaurant.status = status;

        await restaurant.save();

        // DELETE OLD IMAGE ONLY AFTER SUCCESS
        if (imageChanged && oldImageId) {
            try {
                const deleteResult = await cloudinary.uploader.destroy(oldImageId);
                console.log("old image deleted after save:", deleteResult);
            } catch (err) {
                console.log("Cloudinary delete failed:", err.message);
            }
        }

        res.status(200).json({ message: "Restaurant updated successfully" });

    } catch (err) {
        // Delete uploaded image if DB save fails
        if (image_id) {
            try {
                const deleteResult = await cloudinary.uploader.destroy(image_id);
                console.log("new image delete if edit saved err", deleteResult);

            } catch (deleteErr) {
                console.error("Failed to delete image:", deleteErr);
            }
        }
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
