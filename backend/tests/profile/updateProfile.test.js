import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../../server.js';
import mongoose from 'mongoose';
import UserModel from '../../models/userModel.js';
import connectDB from '../../DB/connectDB';

describe('AuthController - updateProfile', () => {
    let mockUserId;
    let mockToken;

    beforeAll(async () => {
        await connectDB();

        if (!process.env.JWT_SECRET) {
            process.env.JWT_SECRET = 'testsecret';
        }

        mockUserId = new mongoose.Types.ObjectId().toString();  // Generating a mock user ID
        mockToken = jwt.sign({ user: { id: mockUserId } }, process.env.JWT_SECRET, { expiresIn: '1h' });  // Mock token
    });

    afterAll(async () => {
        // Close the database connection after all tests are done
        await mongoose.connection.close();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockUpdatedUser = {
        _id: mockUserId,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'johndoe@example.com',
        phone: '0987654321',
        isDonor: false,
        isStudent: true,
        isEmailVerified: true,
    };

    it('should update profile successfully with allowed fields', async () => {
        // Mock findByIdAndUpdate to return an object with a select method
        jest.spyOn(UserModel, 'findByIdAndUpdate').mockReturnValue({
            select: jest.fn().mockResolvedValue(mockUpdatedUser)
        });

        const response = await request(app)
            .put('/api/auth/profile') // Ensure the route is correct
            .set('Authorization', `Bearer ${mockToken}`)
            .send({ first_name: 'Jane', last_name: 'Smith', phone: '0987654321', isDonor: false, isStudent: true });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            first_name: 'Jane',
            last_name: 'Smith',
            phone: '0987654321',
            isDonor: false,
            isStudent: true,
        }));
        expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
            mockUserId,
            { first_name: 'Jane', last_name: 'Smith', phone: '0987654321', isDonor: false, isStudent: true },
            { new: true }
        );
    });

    it('should ignore disallowed fields during update', async () => {
        // Mock findByIdAndUpdate to return an object with a select method
        jest.spyOn(UserModel, 'findByIdAndUpdate').mockReturnValue({
            select: jest.fn().mockResolvedValue(mockUpdatedUser)
        });

        const response = await request(app)
            .put('/api/auth/profile')
            .set('Authorization', `Bearer ${mockToken}`)
            .send({ first_name: 'Jane', email: 'newemail@example.com', password: 'newpassword123' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({
            first_name: 'Jane',
            // email and password should not be updated
            email: 'johndoe@example.com', // Original email
        }));
        expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
            mockUserId,
            { first_name: 'Jane' }, // Only allowed fields are updated
            { new: true }
        );
    });

    it('should return 404 if user not found', async () => {
        // Mock findByIdAndUpdate to return an object with a select method that resolves to null
        jest.spyOn(UserModel, 'findByIdAndUpdate').mockReturnValue({
            select: jest.fn().mockResolvedValue(null)
        });

        const response = await request(app)
            .put('/api/auth/profile')
            .set('Authorization', `Bearer ${mockToken}`)
            .send({ first_name: 'Jane', last_name: 'Smith' });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('msg', 'User not found');
    });

    it('should return 500 on server error', async () => {
        // Mock findByIdAndUpdate to throw an error when select is called
        jest.spyOn(UserModel, 'findByIdAndUpdate').mockReturnValue({
            select: jest.fn().mockRejectedValue(new Error('Database error'))
        });

        const response = await request(app)
            .put('/api/auth/profile')
            .set('Authorization', `Bearer ${mockToken}`)
            .send({ first_name: 'Jane', last_name: 'Smith' });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('msg', 'Server error');
    });

    it('should return 401 if no token is provided', async () => {
        const response = await request(app)
            .put('/api/auth/profile')
            .send({ first_name: 'Jane' });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('msg', 'No token, authorization denied');
    });

    it('should return 401 if token is invalid', async () => {
        const invalidToken = 'invalid.token.here';

        const response = await request(app)
            .put('/api/auth/profile')
            .set('Authorization', `Bearer ${invalidToken}`)
            .send({ first_name: 'Jane' });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('msg', 'Token is not valid');
    });
});
