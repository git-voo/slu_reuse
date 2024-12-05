import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app, server } from '../../server.js'; // Import both app and server
import UserModel from '../../models/userModel.js';

jest.mock('../../models/userModel.js'); // Mock the UserModel

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Change Email API', () => {
    let authToken;

    beforeAll(() => {
        // Generate a valid JWT token for testing
        authToken = jwt.sign({ user: { id: 'user123' } }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    afterAll(async () => {
        if (server && server.close) {
            await server.close();
        }
    });

    it('should successfully change the email', async () => {
        // Mock findById to return a valid user
        jest.spyOn(UserModel, 'findById').mockResolvedValue({
            id: 'user123',
            first_name: 'John',
            last_name: 'Doe',
            email: 'johndoe@example.com',
            isEmailVerified: true,
            save: jest.fn().mockResolvedValue(), // Mock the save method
        });

        // Mock findOne to ensure the new email is not already in use
        jest.spyOn(UserModel, 'findOne').mockResolvedValue(null);

        const response = await request(app)
            .post('/api/auth/change-email')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ newEmail: 'newemail@slu.edu' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg', 'Email changed successfully. Please verify your new email address.');

        // Verify that the user's email and roles were updated correctly
        const mockUser = await UserModel.findById('user123');
        expect(mockUser.email).toBe('newemail@slu.edu');
        expect(mockUser.isEmailVerified).toBe(false);
        expect(mockUser.isSluEmail).toBe(true); // Automatically assigned based on domain
        expect(mockUser.isStudent).toBe(true); // Automatically assigned based on domain
        expect(mockUser.save).toHaveBeenCalled();
    });

    it('should return 400 if the new email is already in use', async () => {
        // Mock findOne to simulate an email already in use
        jest.spyOn(UserModel, 'findOne').mockResolvedValue({
            email: 'newemail@slu.edu',
        });

        const response = await request(app)
            .post('/api/auth/change-email')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ newEmail: 'newemail@slu.edu' });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('msg', 'Email is already in use.');
    });

    it('should return 404 if the user is not found', async () => {
        // Mock findById to return null, simulating user not found
        jest.spyOn(UserModel, 'findById').mockResolvedValue(null);

        const response = await request(app)
            .post('/api/auth/change-email')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ newEmail: 'newemail@slu.edu' });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('msg', 'User not found');
    });

    it('should return 400 if the new email is invalid', async () => {
        const response = await request(app)
            .post('/api/auth/change-email')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ newEmail: 'invalid-email' });

        expect(response.status).toBe(400);
        expect(response.body.errors[0]).toHaveProperty('msg', 'Valid new email is required');
    });

    it('should return 401 if the user is not authenticated', async () => {
        const response = await request(app)
            .post('/api/auth/change-email')
            .send({ newEmail: 'newemail@slu.edu' });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('msg', 'No token, authorization denied');
    });

    it('should return 500 if a server error occurs', async () => {
        // Mock findById to throw an error
        jest.spyOn(UserModel, 'findById').mockImplementationOnce(() => {
            throw new Error('Server error');
        });

        const response = await request(app)
            .post('/api/auth/change-email')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ newEmail: 'newemail@slu.edu' });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('msg', 'Server error');
    });
});
