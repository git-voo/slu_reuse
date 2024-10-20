import { jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { app, server } from '../../server.js';
import UserModel from '../../models/userModel.js';

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Reset Password API', () => {
    let user;

    beforeEach(async() => {
        await UserModel.deleteMany({});
        user = await UserModel.create({
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'janedoe@example.com',
            password: await bcrypt.hash('oldPassword', 10),
            passwordResetCode: '123456',
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

    it('should reset the password successfully', async() => {
        const response = await request(app)
            .post('/api/auth/reset-password')
            .send({
                email: 'janedoe@example.com',
                newPassword: 'newPassword123',
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg', 'Password reset successfully');

        // Verify that the password has been updated
        const updatedUser = await UserModel.findOne({ email: 'janedoe@example.com' });
        const isPasswordMatch = await bcrypt.compare('newPassword123', updatedUser.password);
        expect(isPasswordMatch).toBe(true);
        expect(updatedUser.passwordResetCode).toBe(''); // Ensure reset code is cleared
    });

    it('should return 404 if user is not found', async() => {
        const response = await request(app)
            .post('/api/auth/reset-password')
            .send({
                email: 'nonexistent@example.com',
                newPassword: 'newPassword123',
            });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('msg', 'User not found');
    });

    it('should return 500 if server error occurs', async() => {
        jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => {
            throw new Error('Server error');
        });

        const response = await request(app)
            .post('/api/auth/reset-password')
            .send({
                email: 'janedoe@example.com',
                newPassword: 'newPassword123',
            });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('msg', 'Server error');
    });
});