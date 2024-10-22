import Item from '../models/ItemModel.js';

export const filterItems = async (req, res) => {
    try {
        const { category, location, sort, searchQuery } = req.query;

        let filterCriteria = {};

        // Add category filter if provided (case-insensitive)
        if (category && category !== "all") {
            filterCriteria.category = { $regex: new RegExp(category, 'i') };
        }

        // Add location filter if provided (case-insensitive)
        if (location && location !== "All Locations") {
            filterCriteria.pickupLocation = { $regex: new RegExp(location, 'i') };
        }

        // Add search query filter if provided (case-insensitive)
        if (searchQuery) {
            filterCriteria.name = { $regex: new RegExp(searchQuery, 'i') };
        }
 
        // Query the database with the filter criteria
        let query = Item.find(filterCriteria);

        // Sort by time (newest or oldest) if provided
        if (sort === "newest") {
            query = query.sort({ listedOn: -1 }); // Sort by listedOn date (descending)
        } else if (sort === "oldest") {
            query = query.sort({ listedOn: 1 });  // Sort by listedOn date (ascending)
        }

        // Execute the query
        const items = await query.exec();

        // Return the filtered items
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching items", error });
    }
};
