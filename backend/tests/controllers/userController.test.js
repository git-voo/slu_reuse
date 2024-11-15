import { jest } from '@jest/globals';
import request from 'supertest';
import mockingoose from 'mockingoose';
import { app } from '../../server.js';
import UserModel from '../../models/userModel.js';
import ItemModel from '../../models/itemModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('User Controller - deleteUserAccount', () => {
    let mockToken;

    beforeAll(() => {
        process.env.JWT_SECRET = 'testsecret';
        mockToken = jwt.sign({ user: { id: 'mockUserId' } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    beforeEach(() => {
        mockingoose.resetAll();
    });

    // Test: Missing password
    it('should return 400 if password is not provided', async () => {
        const res = await request(app)
            .delete('/api/user/delete')
            .set('Authorization', `Bearer ${mockToken}`)
            .send({});

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Password is required to delete your account.');
    });

    // Test: User not found
    it('should return 404 if user is not found', async () => {
        mockingoose(UserModel).toReturn(null, 'findOne');

        const res = await request(app)
            .delete('/api/user/delete')
            .set('Authorization', `Bearer ${mockToken}`)
            .send({ password: 'password123' });

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('message', 'User not found.');
    });

    // Test: Incorrect password
    it('should return 401 if password is incorrect', async () => {
        const mockUser = {
            _id: 'mockUserId',
            password: await bcrypt.hash('correctpassword', 10),
        };

        mockingoose(UserModel).toReturn(mockUser, 'findOne');
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(false); // Simulate incorrect password

        const res = await request(app)
            .delete('/api/user/delete')
            .set('Authorization', `Bearer ${mockToken}`)
            .send({ password: 'wrongpassword' });

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('message', 'Incorrect password.');
    });

    // Test: Successful account deletion
    it('should delete user account and their items', async () => {
        const mockUser = {
            _id: 'mockUserId',
            password: await bcrypt.hash('correctpassword', 10),
        };

        mockingoose(UserModel).toReturn(mockUser, 'findOne');
        mockingoose(ItemModel).toReturn({}, 'deleteMany');
        mockingoose(UserModel).toReturn({}, 'findOneAndDelete');
        jest.spyOn(bcrypt, 'compare').mockResolvedValue(true); // Simulate correct password

        const res = await request(app)
            .delete('/api/user/delete')
            .set('Authorization', `Bearer ${mockToken}`)
            .send({ password: 'correctpassword' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message', 'Your account has been deleted successfully.');
    });

    // Test: Server error
    it('should handle server errors', async () => {
        mockingoose(UserModel).toReturn(new Error('Database error'), 'findOne');

        const res = await request(app)
            .delete('/api/user/delete')
            .set('Authorization', `Bearer ${mockToken}`)
            .send({ password: 'password123' });

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('message', 'Internal server error.');
    });
});
