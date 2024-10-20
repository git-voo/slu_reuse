import request from 'supertest';
import app from '../app';
import Item from '../models/ItemModel';

jest.mock('../models/ItemModel');

describe('GET /api/items/:id', () => {
    it('should return an item by ID', async () => {
        const mockItem = {
            _id: '60df5eb4791d4c0aa0a845b8',
            name: 'Laptop',
            category: 'Electronics',
            pickupLocation: 'St. Louis',
        };

        Item.findById.mockResolvedValue(mockItem); // Mock database call

        const response = await request(app).get(`/api/items/${mockItem._id}`);

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Laptop');
    });

    it('should return a 404 if the item is not found', async () => {
        Item.findById.mockResolvedValue(null);

        const response = await request(app).get('/api/items/unknownId');

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Item not found');
    });

    it('should return an error if the query fails', async () => {
        Item.findById.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/api/items/60df5eb4791d4c0aa0a845b8');

        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Database error');
    });
});
