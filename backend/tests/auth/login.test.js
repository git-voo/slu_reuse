import { jest } from '@jest/globals';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { app, server } from '../../server.js';
import UserModel from '../../models/userModel.js';

jest.mock('../../models/userModel.js'); // Mock the UserModel

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Login API', () => {
    afterAll(async() => {
        if (server && server.close) {
            await server.close();
        }
    });

    it('should log in a user successfully with valid credentials', async() => {
        // Mock findOne to return a user with a hashed password
        jest.spyOn(UserModel, 'findOne').mockResolvedValue({
            id: 'mockUserId123',
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'janedoe@example.com',
            password: await bcrypt.hash('password123', 10),
            isDonor: true,
            isStudent: false,
            isEmailVerified: true,
        });

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
            id: 'mockUserId123',
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'janedoe@example.com',
            isDonor: true,
            isStudent: false,
        });
    });

    it('should return 401 if user does not exist', async() => {
        // Mock findOne to return null (user not found)
        jest.spyOn(UserModel, 'findOne').mockResolvedValue(null);

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
        // Mock findOne to return a user with `isEmailVerified` as false
        jest.spyOn(UserModel, 'findOne').mockResolvedValue({
            id: 'mockUserId123',
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'janedoe@example.com',
            password: await bcrypt.hash('password123', 10),
            isDonor: true,
            isStudent: false,
            isEmailVerified: false,
        });

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
        // Mock findOne to return a user with a known hashed password
        jest.spyOn(UserModel, 'findOne').mockResolvedValue({
            id: 'mockUserId123',
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'janedoe@example.com',
            password: await bcrypt.hash('correctpassword', 10),
            isDonor: true,
            isStudent: false,
            isEmailVerified: true,
        });

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
        // Mock findOne to throw an error (simulating a server error)
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