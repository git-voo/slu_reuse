import request from 'supertest';
import app from '../app'; // Import the Express app
import Item from '../models/ItemModel';

jest.mock('../models/ItemModel'); // Mock the Item model

describe('GET /filter', () => {
    it('should filter items based on category, location, and searchQuery', async () => {
        const mockItems = [
            { name: 'Laptop', category: 'Electronics', pickupLocation: 'St. Louis', description: 'New laptop' },
            { name: 'Book', category: 'Books', pickupLocation: 'Chesterfield', description: 'Used book' },
        ];

        Item.find.mockResolvedValue(mockItems); // Mock the database call

        const response = await request(app)
            .get('/api/filter')
            .query({ category: 'Electronics', location: 'St. Louis', searchQuery: 'Laptop' });

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1); // Only one item matches the filter criteria
        expect(response.body[0].name).toBe('Laptop');
    });

    it('should return an error if the query fails', async () => {
        Item.find.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/api/filter');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error fetching items');
    });
});
