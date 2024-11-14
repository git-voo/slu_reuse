import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import mockingoose from 'mockingoose';
import { app } from '../../server.js';
import UserModel from '../../models/userModel.js';

describe('AuthController - updateProfile', () => {
    let mockUserId;
    let mockToken;

    // Define a mock user object
    const mockUser = {
        _id: '60d0fe4f5311236168a109ca',
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        password: 'hashedpassword',
        phone: '1234567890',
        isDonor: true,
        isStudent: false,
        isEmailVerified: true,
    };

    // Define the updated user object
    const mockUpdatedUser = {
        _id: '60d0fe4f5311236168a109ca',
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'johndoe@example.com',
        phone: '0987654321',
        isDonor: false,
        isStudent: true,
        isEmailVerified: true,
    };

    beforeAll(() => {
        // Mock the JWT_SECRET environment variable
        process.env.JWT_SECRET = 'testsecret';

        // Generate a mock user ID and token
        mockUserId = mockUser._id;
        mockToken = jwt.sign({ user: { id: mockUserId } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    beforeEach(() => {
        // Reset all mocks before each test
        mockingoose.resetAll();
    });

    // Test Case: Successful Profile Update with Allowed Fields
    it('should update profile successfully with allowed fields', async () => {
        // Mock the findByIdAndUpdate method to return the updated user
        mockingoose(UserModel).toReturn(mockUpdatedUser, 'findOneAndUpdate');

        const response = await request(app)
            .put('/api/auth/profile') // Ensure the route is correct
            .set('Authorization', `Bearer ${mockToken}`)
            .send({
                first_name: 'Jane',
                last_name: 'Smith',
                phone: '0987654321',
                isDonor: false,
                isStudent: true
            })
            .expect(200);

        expect(response.body).toEqual(expect.objectContaining({
            first_name: 'Jane',
            last_name: 'Smith',
            phone: '0987654321',
            isDonor: false,
            isStudent: true,
        }));
    });

    // Test Case: Ignoring Disallowed Fields During Update
    it('should ignore disallowed fields during update', async () => {
        // Mock the findByIdAndUpdate method to return the updated user
        mockingoose(UserModel).toReturn(mockUpdatedUser, 'findOneAndUpdate');

        const response = await request(app)
            .put('/api/auth/profile')
            .set('Authorization', `Bearer ${mockToken}`)
            .send({
                first_name: 'Jane',
                email: 'newemail@example.com', // Disallowed field
                password: 'newpassword123'      // Disallowed field
            })
            .expect(200);

        expect(response.body).toEqual(expect.objectContaining({
            first_name: 'Jane',
            // email and password should not be updated
            email: 'johndoe@example.com', // Original email remains
        }));
    });

    // Test Case: User Not Found
    it('should return 404 if user not found', async () => {
        // Mock the findByIdAndUpdate method to return null (user not found)
        mockingoose(UserModel).toReturn(null, 'findOneAndUpdate');

        const response = await request(app)
            .put('/api/auth/profile')
            .set('Authorization', `Bearer ${mockToken}`)
            .send({
                first_name: 'Jane',
                last_name: 'Smith'
            })
            .expect(404);

        expect(response.body).toHaveProperty('msg', 'User not found');
    });

    // Test Case: Server Error
    it('should return 500 on server error', async () => {
        // Mock the findByIdAndUpdate method to throw an error
        mockingoose(UserModel).toReturn(new Error('Database error'), 'findOneAndUpdate');

        const response = await request(app)
            .put('/api/auth/profile')
            .set('Authorization', `Bearer ${mockToken}`)
            .send({
                first_name: 'Jane',
                last_name: 'Smith'
            })
            .expect(500);

        expect(response.body).toHaveProperty('msg', 'Server error');
    });

    // Test Case: No Token Provided
    it('should return 401 if no token is provided', async () => {
        const response = await request(app)
            .put('/api/auth/profile')
            .send({
                first_name: 'Jane'
            })
            .expect(401);

        expect(response.body).toHaveProperty('msg', 'No token, authorization denied');
    });

    // Test Case: Invalid Token
    it('should return 401 if token is invalid', async () => {
        const invalidToken = 'invalid.token.here';

        const response = await request(app)
            .put('/api/auth/profile')
            .set('Authorization', `Bearer ${invalidToken}`)
            .send({
                first_name: 'Jane'
            })
            .expect(401);

        expect(response.body).toHaveProperty('msg', 'Token is not valid');
    });
});
