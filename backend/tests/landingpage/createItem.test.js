import request from 'supertest';
import app from '../app'; // Express app
import Item from '../models/ItemModel';

jest.mock('../models/ItemModel'); // Mock the Item model

describe('POST /api/items', () => {
    it('should create a new item', async () => {
        const mockItem = {
            name: 'Laptop',
            images: ['image1.jpg'],
            description: 'A new laptop',
            category: 'Electronics',
            pickupLocation: 'St. Louis',
            donor: 'User123'
        };

        Item.prototype.save = jest.fn().mockResolvedValue(mockItem); // Mock save method

        const response = await request(app)
            .post('/api/items')
            .send(mockItem);

        expect(response.status).toBe(201);
        expect(response.body.name).toBe('Laptop');
    });

    it('should return a 400 error if required fields are missing', async () => {
        const response = await request(app)
            .post('/api/items')
            .send({ name: '' }); // Send invalid data

        expect(response.status).toBe(400);
    });
});
