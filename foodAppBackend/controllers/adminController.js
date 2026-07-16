const cloudinary = require("../config/cloudinary");
const Area = require("../models/Area");
const Food = require("../models/Food");
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const mongoose = require("mongoose");

const getArea = async (req, res) => {
    try {
        const areas = await Area.find().lean();
        res.status(200).json(areas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getAreaById = async (req, res) => {
    try {
        const { areaId } = req.params;
        if (!areaId || !mongoose.Types.ObjectId.isValid(areaId)) {
            return res.status(400).json({ success: false, message: "Invalid area ID" });
        }

        const areas = await Area.findById(areaId);
        if (!areas) return res.status(404).json({ message: 'No Area Found.' })
        res.status(200).json(areas);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const addArea = async (req, res) => {
    const { code, name, delivery_charge_in_rs, delivery_text = '', status = true } = req.body;

    if (!code || !name || !delivery_charge_in_rs) {
        return res.status(400).json({ message: "All Fields Are Required" });
    }

    try {
        const existing = await Area.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: "Name Already Exists." });
        }

        const newArea = new Area({
            code,
            name,
            delivery_charge_in_rs,
            delivery_text,
            status,
        });

        await newArea.save();

        res.status(201).json({ message: "Code Added Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

const editArea = async (req, res) => {
    const { id } = req.params;
    const { code, name, delivery_charge_in_rs, delivery_text, status } = req.body;

    if (!id) {
        return res.status(400).json({ message: "Area ID is required" });
    }

    if (!code || !name) {
        return res.status(400).json({ message: "Code and Name are required" });
    }

    try {
        // check if area exists
        const area = await Area.findById(id);
        if (!area) {
            return res.status(404).json({ message: "Area not found" });
        }

        // check if the new Name is already taken by a DIFFERENT area
        const duplicate = await Area.findOne({ name, _id: { $ne: id } });
        if (duplicate) {
            return res.status(400).json({ message: "Area Name already exists." });
        }

        await Area.findByIdAndUpdate(
            id,
            {
                $set: {
                    code,
                    name,
                    delivery_charge_in_rs,
                    delivery_text,
                    ...(status !== undefined && { status }),
                },
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: "Area Updated Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

const getFoodItemsList = async (req, res) => {
    try {
        const foods = await Food.find().lean();
        res.status(200).json(foods);
    } catch (err) {
        res.status(500).json({ message: "Server Error", err });
    }
};

const addFoodItems = async (req, res) => {
    try {
        const { restaurant_id, name, price, mrp, quantity_info, category } = req.body;
        if (!restaurant_id || !name || !price || !mrp || !quantity_info || !category) return res.status(400).json({ message: "Bad Request." });

        await Food.create(req.body);

        res.status(201).json({ message: 'Food item Added.' });
    } catch (err) {
        res.status(500).json({ message: "Server error", err });
    }
};

const editFoodItems = async (req, res) => {
    try {
        const { id } = req.params;
        const { restaurant_id, name, price, mrp, quantity_info, category, stock_order, sort_order, status, in_stock, image_id, image_url } = req.body;
        if (!id || !restaurant_id || !name || !price || !mrp || !quantity_info || !category) return res.status(400).json({ error: "Bad Request." });

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
        food.stock_order = stock_order;
        food.sort_order = sort_order;
        food.status = status;
        food.in_stock = in_stock;
        food.image_url = image_url;
        food.image_id = image_id;

        await food.save();
        res.status(200).json({ message: 'Edit Success.' });

    } catch (err) {
        res.status(500).json({ message: "Server error", err });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: "items.foodId",        // populate foodId first
                populate: { path: "restaurant_id" } // nested populate inside food
            }).lean();

        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const addRestaurants = async (req, res) => {
    const { name, image_url, area_id, image_id, category, is_banner = false, sort_order = 0 } = req.body;
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
        res.status(201).json({ message: 'Create Success' });
    } catch (err) {
        // Delete uploaded image if DB save fails
        if (image_id) {
            try {
                await cloudinary.uploader.destroy(image_id);
            } catch (deleteErr) {
                console.error("Failed to delete image:", deleteErr);
            }
        }
        res.status(500).json({ message: 'Server Error', err });
    }
};

const addProductToCategory = async (req, res) => {
    try {
        const { name, price, image_url, restaurantId, category, area_code } = req.body;
        if (!restaurantId) return res.status(400).json({ message: "Restaurant ID required" });

        const foodItem = await Food.create({
            name,
            price,
            category,
            image_url,
            area_code,
            restaurant: restaurantId,
        });

        res.status(201).json({ message: 'Create Success' });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

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

    try {
        if (!id || !name) {
            return res.status(400).json({ message: "Required fields missing" });
        }

        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
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
        res.status(500).json({ message: "Server error" });
    }
};

const getRestaurantById = async (req, res) => {
    try {
        const items = await Restaurant.findById(req.params.id);
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: 'Server Err', err })
    }
};

const getFoodItemsById = async (req, res) => {
    try {
        if (!req.params.id) return res.status(400).json({ message: 'Bad Request.' })
        const item = await Food.findById(req.params.id);
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ message: 'Server Err', err })
    }
};

module.exports = {
    getFoodItemsList,
    getAreaById,
    getArea,
    addArea,
    editArea,
    getRestaurantById,
    addRestaurants,
    editCategoryById,
    addProductToCategory,
    getFoodItemsById,
    addFoodItems,
    editFoodItems,
    getAllOrders,
};
