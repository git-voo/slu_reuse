import request from 'supertest';  // To test API routes
import express from 'express';    // To create an express app
import mongoose from 'mongoose';  // To mock the database connection
import itemRoutes from '../../routes/itemRoutes.js';  // Import the item routes
import { jest } from '@jest/globals';  // Use jest for mocking
import ItemModel from '../../models/ItemModel.js';  // Import the Item model

// Mock the ItemModel module so that no real DB operations are performed
jest.mock('../../models/ItemModel.js');

let app;

beforeAll(() => {
    // Set up express app for testing
    app = express();
    app.use(express.json());  // Parse JSON request bodies
    app.use('/api', itemRoutes);  // Use the item routes under '/api' prefix
});

afterAll(() => {
    jest.clearAllMocks();  // Clear all mocks after the tests
});

describe('Item Controller with Mocked Database #items', () => {
    const mockItem = { _id: '617f1f77bcf86cd799439011', name: 'Test Item', description: 'A test item' };

    it('should get all items', async () => {
        // Mock the find method of ItemModel to return a test item
        ItemModel.find = jest.fn().mockResolvedValue([mockItem]);

        const res = await request(app).get('/api/items');  // Send GET request to fetch items
        expect(res.statusCode).toBe(200);  // Expect 200 OK
        expect(res.body).toHaveLength(1);  // Expect 1 item in response
        expect(res.body[0].name).toBe('Test Item');  // Expect the item's name to be 'Test Item'
    });

    it('should get an item by ID', async () => {
        // Mock the findById method of ItemModel
        ItemModel.findById = jest.fn().mockResolvedValue(mockItem);

        const res = await request(app).get(`/api/items/${mockItem._id}`);  // Send GET request for specific item
        expect(res.statusCode).toBe(200);  // Expect 200 OK
        expect(res.body.name).toBe('Test Item');  // Check if the item name is 'Test Item'
    });
    it('should create a new item', async () => {
        // Mock payload that will be sent to the API
        const mockPayload = {
            "name": "Gently Used Sofa",
            "images": [
                "https://example.com/images/sofa1.jpg",
                "https://example.com/images/sofa2.jpg"
            ],
            "description": "A gently used sofa in good condition. Perfect for a small living room.",
            "category": "Furniture",
            "quantity": 1,
            "pickupLocation": "123 Main St, St Louis, MO",
            "tags": [
                "sofa",
                "furniture",
                "living room"
            ],
            "donor":  "60d0fe4f5311236168a109ca",
            "status": "available"
        };
    
        // Mock the result that ItemModel.create should return
        const mockResult = {
            ...mockPayload,
            "_id": "671737fd7350daa9659ead15",
            "listedOn": "2024-10-22T05:28:29.299Z",
            "__v": 0
        };
    
        // Mock ItemModel.create to return the mock result
        ItemModel.create = jest.fn().mockResolvedValue(mockResult);
    
        // Send the POST request to create a new item
        const res = await request(app).post('/api/items').send(mockPayload);
     
        expect(res.statusCode).toBe(201);
     
        expect(res.body.name).toBe('Gently Used Sofa');  // Correct expectation
        expect(res.body._id).toBe('671737fd7350daa9659ead15');  // Correct expectation for _id
    }, 30000);  // Increased timeout to 30 seconds
     
    it('should update an existing item', async () => {
        const updatedItem = { ...mockItem, name: 'Updated Item' };
        // Mock the findByIdAndUpdate method of ItemModel
        ItemModel.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedItem);

        const res = await request(app).put(`/api/items/${mockItem._id}`).send({
            name: 'Updated Item'
        });  // Send PUT request to update the item

        expect(res.statusCode).toBe(200);  // Expect 200 OK
        expect(res.body.name).toBe('Updated Item');  // Expect the updated name to be 'Updated Item'
    });

    it('should delete an item', async () => {
        // Mock the findByIdAndDelete method of ItemModel
        ItemModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockItem);

        const res = await request(app).delete(`/api/items/${mockItem._id}`);  // Send DELETE request for the item

        expect(res.statusCode).toBe(200);  // Expect 200 OK
        expect(res.body.message).toBe('Item deleted successfully');  // Expect successful deletion message
    });

    it('should return 404 if item not found', async () => {
        // Mock findById to return null for non-existent item
        ItemModel.findById = jest.fn().mockResolvedValue(null);

        const fakeId = '617f1f77bcf86cd799439099';  // A fake ID for testing 404
        const res = await request(app).get(`/api/items/${fakeId}`);  // Send GET request for non-existent item

        expect(res.statusCode).toBe(404);  // Expect 404 Not Found
        expect(res.body.message).toBe('Item not found');  // Expect 'Item not found' message
    });
});
