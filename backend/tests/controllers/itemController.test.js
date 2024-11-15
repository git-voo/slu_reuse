import { jest } from '@jest/globals';
import request from 'supertest';
import mockingoose from 'mockingoose';
import { app } from '../../server.js';
import ItemModel from '../../models/itemModel.js';
import jwt from 'jsonwebtoken';

describe('Item Controller', () => {
    let mockToken;

    beforeAll(() => {
        // Set up a mock token for authenticated requests
        process.env.JWT_SECRET = 'testsecret';
        mockToken = jwt.sign({ user: { id: 'mockUserId' } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    beforeEach(() => {
        mockingoose.resetAll();
    });

    // Test: Get all items
    describe('GET /items', () => {
        it.skip('should return all items', async () => {
            const mockItems = [
                { _id: 'item1', name: 'Item 1', description: 'Description 1', donor: 'mockUserId' },
                { _id: 'item2', name: 'Item 2', description: 'Description 2', donor: 'mockUserId' },
            ];

            mockingoose(ItemModel).toReturn(mockItems, 'find');

            const res = await request(app).get('/api/items').expect(200);

            expect(res.body).toEqual(mockItems);
        });

        it('should handle server errors', async () => {
            mockingoose(ItemModel).toReturn(new Error('Database error'), 'find');

            const res = await request(app).get('/api/items').expect(500);

            expect(res.body).toHaveProperty('message', 'Database error');
        });
    });

    // Test: Get item by ID
    describe('GET /items/:id', () => {
        it.skip('should return a single item by ID', async () => {
            const mockItem = { _id: 'item1', name: 'Item 1', description: 'Description 1', donor: 'mockUserId' };

            mockingoose(ItemModel).toReturn(mockItem, 'findOne');

            const res = await request(app).get('/api/items/item1').expect(200);

            expect(res.body).toEqual(mockItem);
        });

        it('should return 404 if item is not found', async () => {
            mockingoose(ItemModel).toReturn(null, 'findOne');

            const res = await request(app).get('/api/items/item1').expect(404);

            expect(res.body).toHaveProperty('message', 'Item not found');
        });

        it('should handle server errors', async () => {
            mockingoose(ItemModel).toReturn(new Error('Database error'), 'findOne');

            const res = await request(app).get('/api/items/item1').expect(500);

            expect(res.body).toHaveProperty('message', 'Database error');
        });
    });

    // Test: Create a new item
    describe('POST /items', () => {
        it.skip('should create a new item', async () => {
            const mockNewItem = { name: 'New Item', description: 'New Item Description', donor: 'mockUserId' };

            mockingoose(ItemModel).toReturn(mockNewItem, 'save');

            const res = await request(app)
                .post('/api/items')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(mockNewItem)
                .expect(201);

            expect(res.body).toEqual(mockNewItem);
        });

        it('should handle validation errors', async () => {
            mockingoose(ItemModel).toReturn(new Error('Validation error'), 'save');

            const res = await request(app)
                .post('/api/items')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({})
                .expect(400);

            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('required'); // Check for "required" in the validation error
        });
    });

    // Test: Update an item
    describe('PUT /items/:id', () => {
        it.skip('should update an existing item', async () => {
            const mockUpdatedItem = { _id: 'item1', name: 'Updated Item', description: 'Updated Description' };

            mockingoose(ItemModel).toReturn(mockUpdatedItem, 'findOneAndUpdate');

            const res = await request(app)
                .put('/api/items/item1')
                .set('Authorization', `Bearer ${mockToken}`)
                .send(mockUpdatedItem)
                .expect(200);

            expect(res.body).toEqual(mockUpdatedItem);
        });

        it('should return 404 if item is not found', async () => {
            mockingoose(ItemModel).toReturn(null, 'findOneAndUpdate');

            const res = await request(app)
                .put('/api/items/item1')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({})
                .expect(404);

            expect(res.body).toHaveProperty('message', 'Item not found');
        });

        it('should handle validation errors', async () => {
            mockingoose(ItemModel).toReturn(new Error('Validation error'), 'findOneAndUpdate');

            const res = await request(app)
                .put('/api/items/item1')
                .set('Authorization', `Bearer ${mockToken}`)
                .send({})
                .expect(400);

            expect(res.body).toHaveProperty('message', 'Validation error');
        });
    });

    // Test: Delete an item
    describe('DELETE /items/:id', () => {
        it('should delete an item', async () => {
            mockingoose(ItemModel).toReturn({ _id: 'item1' }, 'findOneAndDelete');

            const res = await request(app)
                .delete('/api/items/item1')
                .set('Authorization', `Bearer ${mockToken}`)
                .expect(200);

            expect(res.body).toHaveProperty('message', 'Item deleted successfully');
        });

        it('should return 404 if item is not found', async () => {
            mockingoose(ItemModel).toReturn(null, 'findOneAndDelete');

            const res = await request(app)
                .delete('/api/items/item1')
                .set('Authorization', `Bearer ${mockToken}`)
                .expect(404);

            expect(res.body).toHaveProperty('message', 'Item not found');
        });

        it('should handle server errors', async () => {
            mockingoose(ItemModel).toReturn(new Error('Database error'), 'findOneAndDelete');

            const res = await request(app)
                .delete('/api/items/item1')
                .set('Authorization', `Bearer ${mockToken}`)
                .expect(500);

            expect(res.body).toHaveProperty('message', 'Database error');
        });
    });
});
