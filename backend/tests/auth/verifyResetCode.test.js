import { jest } from '@jest/globals';
import request from 'supertest';
import { app, server } from '../../server.js';
import UserModel from '../../models/userModel.js';

jest.mock('../../models/userModel.js'); // Mock the UserModel

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Verify Reset Code API', () => {
    afterAll(async() => {
        if (server && server.close) {
            await server.close();
        }
    });

    it('should verify the reset code successfully', async() => {
        // Mock findOne to return a user with a valid reset code
        jest.spyOn(UserModel, 'findOne').mockResolvedValue({
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'janedoe@example.com',
            password: 'hashedpassword',
            passwordResetCode: '123456',
            isDonor: true,
            isStudent: false,
        });

        const response = await request(app)
            .post('/api/auth/verify-reset-code')
            .send({
                email: 'janedoe@example.com',
                verificationCode: '123456',
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg', 'Code verified successfully');
    });

    it('should return 400 if validation fails', async() => {
        const response = await request(app)
            .post('/api/auth/verify-reset-code')
            .send({
                email: '',
                verificationCode: '',
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('should return 500 if server error occurs', async() => {
        // Mock findOne to throw an error, simulating a server error
        jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => {
            throw new Error('Server error');
        });

        const response = await request(app)
            .post('/api/auth/verify-reset-code')
            .send({
                email: 'janedoe@example.com',
                verificationCode: '123456',
            });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('msg', 'Server error');
    });
});