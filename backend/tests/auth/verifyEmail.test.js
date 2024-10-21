import { jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { app, server } from '../../server.js'; // Import both app and server
import UserModel from '../../models/userModel.js';

describe('Verify Email API', () => {
    let verificationToken;
    let user;

    beforeEach(async() => {
        await UserModel.deleteMany({});
        user = await UserModel.create({
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'janedoe@example.com',
            password: 'hashedpassword',
            isDonor: true,
            isStudent: false,
            isEmailVerified: false,
        });

        verificationToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    });

    afterAll(async() => {
        await mongoose.connection.close();
        if (server && server.close) {
            await server.close();
        }
        // A short delay to ensure cleanup
        await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    it('should verify the email successfully', async() => {
        const response = await request(app)
            .post('/api/auth/verify-email')
            .send({ token: verificationToken });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('msg', 'Email verified successfully');
    });

    it('should return 400 if token is not provided', async() => {
        const response = await request(app)
            .post('/api/auth/verify-email')
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('msg', 'Token is required');
    });

    it('should return 400 if user does not exist', async() => {
        const fakeToken = jwt.sign({ email: 'nonexistent@example.com' }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const response = await request(app)
            .post('/api/auth/verify-email')
            .send({ token: fakeToken });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('msg', 'Invalid token or user does not exist.');
    });

    it('should return 400 if email is already verified', async() => {
        user.isEmailVerified = true;
        await user.save();

        const response = await request(app)
            .post('/api/auth/verify-email')
            .send({ token: verificationToken });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('msg', 'Email is already verified');
    });

    it('should return 401 if token is expired', async() => {
        const expiredToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '-1h' });

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
        jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => {
            throw new Error('Server error');
        });

        const response = await request(app)
            .post('/api/auth/verify-email')
            .send({ token: verificationToken });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('msg', 'Server error');
    });
});