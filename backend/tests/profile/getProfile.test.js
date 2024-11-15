import request from 'supertest';
import jwt from 'jsonwebtoken';
import mockingoose from 'mockingoose';
import { app } from '../../server.js';
import UserModel from '../../models/userModel.js';

describe('AuthController - getProfile', () => {
    let mockUserId;
    let mockToken;

    // Define a mock user object
    const mockUser = {
        _id: '60d0fe4f5311236168a109ca',
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        phone: '1234567890',
        isDonor: true,
        isStudent: false,
        isEmailVerified: true,
    };

    beforeAll(() => {
        // Mock the JWT_SECRET environment variable
        process.env.JWT_SECRET = 'testsecret';

        // Generate a mock user ID and token
        mockUserId = mockUser._id;
        mockToken = jwt.sign({ user: { id: mockUserId } }, process.env.JWT_SECRET, { expiresIn: '12h' });
    });

    beforeEach(() => {
        // Reset all mocks before each test
        mockingoose.resetAll();
    });

    // Test Case: Successful Profile Retrieval
    it('should return user profile successfully when a valid token is provided', async () => {
        // Mock the findById method to return the mock user
        mockingoose(UserModel).toReturn(mockUser, 'findOne');

        const res = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${mockToken}`)
            .expect(200);

        expect(res.body).toHaveProperty('first_name', 'John');
        expect(res.body).toHaveProperty('last_name', 'Doe');
        expect(res.body).toHaveProperty('email', 'johndoe@example.com');
        expect(res.body).toHaveProperty('phone', '1234567890');
        // Removed the following line as it's incorrect
        // expect(UserModel.findById).not.toHaveBeenCalled();
    });

    // Test Case: User Not Found
    it('should return 404 if the user is not found', async () => {
        // Mock the findById method to return null (user not found)
        mockingoose(UserModel).toReturn(null, 'findOne');

        const res = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${mockToken}`)
            .expect(404);

        expect(res.body).toHaveProperty('msg', 'User not found');
    });

    // Test Case: Server Error
    it('should return 500 if there is a server error', async () => {
        // Mock the findById method to throw an error
        mockingoose(UserModel).toReturn(new Error('Server error'), 'findOne');

        const res = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${mockToken}`)
            .expect(500);

        expect(res.body).toHaveProperty('msg', 'Server error');
    });

    // Test Case: No Token Provided
    it('should return 401 if no token is provided', async () => {
        const res = await request(app)
            .get('/api/auth/profile')
            .expect(401);

        expect(res.body).toHaveProperty('msg', 'No token, authorization denied');
    });

    // Test Case: Invalid Token
    it('should return 401 if token is invalid', async () => {
        const invalidToken = 'invalid.token.here';

        const res = await request(app)
            .get('/api/auth/profile')
            .set('Authorization', `Bearer ${invalidToken}`)
            .expect(401);

        expect(res.body).toHaveProperty('msg', 'Token is not valid');
    });
});
