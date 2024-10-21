import { jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { app, server } from '../../server.js';
import UserModel from '../../models/userModel.js';

describe('Login API', () => {
    let user;

    beforeEach(async() => {
        await UserModel.deleteMany({});
        user = await UserModel.create({
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'janedoe@example.com',
            password: await bcrypt.hash('password123', 10),
            isDonor: true,
            isStudent: false,
            isEmailVerified: true,
        });
    });

    afterAll(async() => {
        await mongoose.connection.close();
        if (server && server.close) {
            await server.close();
        }
        // A short delay to ensure cleanup
        await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    it('should log in a user successfully with valid credentials', async() => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'janedoe@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg', 'Logged in successfully');
        expect(response.body).toHaveProperty('token');
        expect(response.body.user).toEqual({
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            isDonor: user.isDonor,
            isStudent: user.isStudent,
        });
    });

    it('should return 401 if user does not exist', async() => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('msg', 'Invalid credentials');
    });

    it('should return 403 if email is not verified', async() => {
        user.isEmailVerified = false;
        await user.save();

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'janedoe@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty('msg', 'Email not verified. Please verify your email before logging in.');
    });

    it('should return 401 if password is incorrect', async() => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'janedoe@example.com',
                password: 'wrongpassword',
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('msg', 'Invalid credentials');
    });

    it('should return 500 if server error occurs', async() => {
        jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => {
            throw new Error('Server error');
        });

        const response = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'janedoe@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('msg', 'Server error');
    });
});