import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app, server } from '../../server.js';
import UserModel from '../../models/userModel.js';

// Mock the UserModel
jest.mock('../../models/userModel.js');

// Helper function to generate a mock token
const generateMockToken = (userId) => {
    return jwt.sign({ user: { id: userId } }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('GET /api/profile', () => {
    const mockUserId = 'mockUserId123';
    const mockToken = generateMockToken(mockUserId);

    afterAll(async () => {
        if (server && server.close) {
            await server.close();
        }
    });

    it('should retrieve the user profile successfully', async () => {
        // Spy on the JWT.verify to return the decoded token
        jest.spyOn(jwt, 'verify').mockImplementation(() => ({ user: { id: mockUserId } }));

        // Mock UserModel.findById to return a user object
        jest.spyOn(UserModel, 'findById').mockResolvedValue({
            id: mockUserId,
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@example.com',
            phone: '1234567890',
            isDonor: true,
            isStudent: false,
            isEmailVerified: true,
        });

        const response = await request(app)
            .get('/api/profile')
            .set('Authorization', `Bearer ${mockToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: mockUserId,
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@example.com',
            phone: '1234567890',
            isDonor: true,
            isStudent: false,
            isEmailVerified: true,
        });
        expect(UserModel.findById).toHaveBeenCalledWith(mockUserId);
    });

    it('should return 404 if user is not found', async () => {
        // Spy on the JWT.verify to return the decoded token
        jest.spyOn(jwt, 'verify').mockImplementation(() => ({ user: { id: mockUserId } }));

        // Mock UserModel.findById to return null
        jest.spyOn(UserModel, 'findById').mockResolvedValue(null);

        const response = await request(app)
            .get('/api/profile')
            .set('Authorization', `Bearer ${mockToken}`);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('msg', 'User not found');
        expect(UserModel.findById).toHaveBeenCalledWith(mockUserId);
    });

    it('should return 500 if server error occurs', async () => {
        // Spy on the JWT.verify to return the decoded token
        jest.spyOn(jwt, 'verify').mockImplementation(() => ({ user: { id: mockUserId } }));

        // Mock UserModel.findById to throw an error
        jest.spyOn(UserModel, 'findById').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .get('/api/profile')
            .set('Authorization', `Bearer ${mockToken}`);

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('msg', 'Server error');
        expect(UserModel.findById).toHaveBeenCalledWith(mockUserId);
    });
});
