import { jest } from '@jest/globals';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { app, server } from '../../server.js';
import UserModel from '../../models/userModel.js';

jest.mock('../../models/userModel.js'); // Mock the UserModel

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Reset Password API', () => {
    afterAll(async() => {
        if (server && server.close) {
            await server.close();
        }
    });

    it('should reset the password successfully', async() => {
        // Mock findOne to return a user with a reset code
        jest.spyOn(UserModel, 'findOne').mockResolvedValue({
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'janedoe@example.com',
            password: await bcrypt.hash('oldPassword', 10),
            passwordResetCode: '123456',
            save: jest.fn().mockResolvedValue(), // Mock the save method on the user instance
        });

        const response = await request(app)
            .post('/api/auth/reset-password')
            .send({
                email: 'janedoe@example.com',
                newPassword: 'newPassword123',
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg', 'Password reset successfully');

        // Verify that the save method was called, indicating that the password was updated
        const mockUser = await UserModel.findOne();
        expect(mockUser.save).toHaveBeenCalled();
        // Verify that the password is updated
        const isPasswordMatch = await bcrypt.compare('newPassword123', mockUser.password);
        expect(isPasswordMatch).toBe(true);
        expect(mockUser.passwordResetCode).toBe(''); // Ensure reset code is cleared
    });

    it('should return 404 if user is not found', async() => {
        // Mock findOne to return null, simulating that the user does not exist
        jest.spyOn(UserModel, 'findOne').mockResolvedValue(null);

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
        // Mock findOne to throw an error, simulating a server error during the user lookup
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