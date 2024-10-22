import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app, server } from '../../server.js'; // Import both app and server
import UserModel from '../../models/userModel.js';

jest.mock('../../models/userModel.js'); // Mock the UserModel

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Verify Email API', () => {
    let verificationToken;

    afterAll(async() => {
        if (server && server.close) {
            await server.close();
        }
    });

    it('should verify the email successfully', async() => {
        // Mock findOne to return a user with unverified email
        jest.spyOn(UserModel, 'findOne').mockResolvedValue({
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'janedoe@example.com',
            isEmailVerified: false,
            save: jest.fn().mockResolvedValue(), // Mock the save method on the user instance
        });

        // Generate a verification token
        verificationToken = jwt.sign({ email: 'janedoe@example.com' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const response = await request(app)
            .post('/api/auth/verify-email')
            .send({ token: verificationToken });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg', 'Email verified successfully');

        // Verify that save was called to update email verification status
        const mockUser = await UserModel.findOne();
        expect(mockUser.save).toHaveBeenCalled();
        expect(mockUser.isEmailVerified).toBe(true);
    });

    it('should return 400 if token is not provided', async() => {
        const response = await request(app)
            .post('/api/auth/verify-email')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('msg', 'Token is required');
    });

    it('should return 400 if user does not exist', async() => {
        // Mock findOne to return null, simulating user not found
        jest.spyOn(UserModel, 'findOne').mockResolvedValue(null);

        const fakeToken = jwt.sign({ email: 'nonexistent@example.com' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const response = await request(app)
            .post('/api/auth/verify-email')
            .send({ token: fakeToken });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('msg', 'Invalid token or user does not exist.');
    });

    it('should return 400 if email is already verified', async() => {
        // Mock findOne to return a user with `isEmailVerified` as true
        jest.spyOn(UserModel, 'findOne').mockResolvedValue({
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'janedoe@example.com',
            isEmailVerified: true,
            save: jest.fn(),
        });

        verificationToken = jwt.sign({ email: 'janedoe@example.com' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const response = await request(app)
            .post('/api/auth/verify-email')
            .send({ token: verificationToken });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('msg', 'Email is already verified');
    });

    it('should return 401 if token is expired', async() => {
        const expiredToken = jwt.sign({ email: 'janedoe@example.com' }, process.env.JWT_SECRET, { expiresIn: '-1h' });

        const response = await request(app)
            .post('/api/auth/verify-email')
            .send({ token: expiredToken });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('msg', 'Token has expired');
    });

    it('should return 401 if token is invalid', async() => {
        const response = await request(app)
            .post('/api/auth/verify-email')
            .send({ token: 'invalid-token' });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('msg', 'Invalid token');
    });

    it('should return 500 if server error occurs', async() => {
        // Mock findOne to throw an error, simulating a server error
        jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => {
            throw new Error('Server error');
        });

        verificationToken = jwt.sign({ email: 'janedoe@example.com' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const response = await request(app)
            .post('/api/auth/verify-email')
            .send({ token: verificationToken });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('msg', 'Server error');
    });
});