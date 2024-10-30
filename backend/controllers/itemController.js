import ItemModel from "../models/ItemModel.js"
/**
 * Route controllers for all /items routes
 * 
 * @author Victor Onoja
 * https://github.com/git-voo 
 */

// Get all items
export const getItems = async (req, res) => {
    try {
        const items = await ItemModel.find()
        res.status(200).json(items)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get a single item by ID
export const getItemById = async (req, res) => {
    try {
        const item = await ItemModel.findById(req.params.id).populate("donor")
        if (!item) return res.status(404).json({ message: 'Item not found' })
        res.status(200).json(item)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Create a new item
export const createItem = async (req, res) => {
    try {
        const newItemData = req.body;
        newItemData.donor = req.user.id; // Attach the donor field

        const newItem = new ItemModel(newItemData);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an existing item
export const updateItem = async (req, res) => {
    try {
        const updatedItem = await ItemModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (!updatedItem) return res.status(404).json({ message: 'Item not found' })
        res.status(200).json(updatedItem)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
}

// Delete an item
export const deleteItem = async (req, res) => {
    try {
        const deletedItem = await ItemModel.findByIdAndDelete(req.params.id)
        if (!deletedItem) return res.status(404).json({ message: 'Item not found' })
        res.status(200).json({ message: 'Item deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
