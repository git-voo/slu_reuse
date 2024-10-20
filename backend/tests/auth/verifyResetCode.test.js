import { jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { app, server } from '../../server.js';
import UserModel from '../../models/userModel.js';

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Verify Reset Code API', () => {
    let user;

    beforeEach(async() => {
        await UserModel.deleteMany({});
        user = await UserModel.create({
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'janedoe@example.com',
            password: 'hashedpassword',
            passwordResetCode: '123456', // Set a known reset code for testing
            isDonor: true,
            isStudent: false,
        });
    });

    afterAll(async() => {
        await mongoose.connection.close();
        if (server && server.close) {
            await server.close();
        }
        // Add a short delay to ensure cleanup
        await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    it('should verify the reset code successfully', async() => {
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