import { jest } from '@jest/globals';
import request from 'supertest';
import { app } from '../../server.js';
import mongoose from 'mongoose';
import UserModel from '../../models/userModel.js';
import jwt from 'jsonwebtoken';
import connectDB from '../../DB/connectDB';

describe('AuthController - getProfile', () => {
    let mockUserId;
    let mockToken;

    beforeAll(async () => {
        // Connect to the database before tests
        await connectDB();

        // Set up mock data
        mockUserId = new mongoose.Types.ObjectId().toString();  // Generating a mock user ID
        mockToken = jwt.sign({ user: { id: mockUserId } }, process.env.JWT_SECRET, { expiresIn: '12h' });  // Mock token
    });

    afterAll(async () => {
        // Close the database connection after all tests are done
        await mongoose.connection.close();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return user profile successfully when a valid token is provided', async () => {
        const mockUser = {
            _id: mockUserId,
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@example.com',
            phone: '1234567890',
            isDonor: true,
            isStudent: false
        };

        UserModel.findById = jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue(mockUser)
        });

        const res = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${mockToken}`);

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('first_name', 'John');
        expect(res.body).toHaveProperty('last_name', 'Doe');
        expect(UserModel.findById).toHaveBeenCalledWith(mockUserId);
    });

    it('should return 404 if the user is not found', async () => {
        UserModel.findById = jest.fn().mockReturnValue({
            select: jest.fn().mockResolvedValue(null)
        });

        const res = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${mockToken}`);

        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('msg', 'User not found');
    });

    it('should return 500 if there is a server error', async () => {
        UserModel.findById = jest.fn().mockReturnValue({
            select: jest.fn().mockRejectedValue(new Error('Server error'))
        });

        const res = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${mockToken}`);

        expect(res.status).toBe(500);
        expect(res.body).toHaveProperty('msg', 'Server error');
    });

    it('should return 401 if no token is provided', async () => {
        const res = await request(app)
            .get('/api/auth/profile');

        expect(res.status).toBe(401);
        expect(res.body).toHaveProperty('msg', 'No token, authorization denied');
    });
});
