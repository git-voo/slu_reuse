import Item from '../models/ItemModel.js';

export const filterItems = async (req, res) => {
    try {
        const { category, location, timeOrder } = req.query;

        let filterCriteria = {};

        // Add category filter if provided (case-insensitive)
        if (category) {
            filterCriteria.category = { $regex: new RegExp(category, 'i') };
        }

        // Add location filter if provided (case-insensitive)
        if (location) {
            filterCriteria.location = { $regex: new RegExp(location, 'i') };
        }

        // Query the database with the filter criteria
        let query = Item.find(filterCriteria);

        // Sort by time update if provided
        if (timeOrder === 'newest') {
            query = query.sort({ updatedAt: -1 });
        } else if (timeOrder === 'oldest') {
            query = query.sort({ updatedAt: 1 });
        }

        // Execute the query
        const items = await query.exec();

        // Return the filtered items
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching items', error });
    }
};
 
