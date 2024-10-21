import { jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { app, server } from '../../server.js';
import UserModel from '../../models/userModel.js';
import nodemailer from 'nodemailer'; // Import nodemailer to mock it

const sendMailMock = jest.fn();

jest.mock('nodemailer');

//  createTransport method to return an object with the mocked sendMail function
nodemailer.createTransport = jest.fn().mockReturnValue({
    sendMail: sendMailMock,
});

beforeEach(() => {
    jest.clearAllMocks();
    sendMailMock.mockClear();
    nodemailer.createTransport.mockClear();
});

describe('Forgot Password API', () => {
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

    it('should send reset password email successfully', async() => {
        // Mocking sendMail to simulate a successful email send as a promise-based function
        sendMailMock.mockResolvedValueOnce({
            status: 200,
            message: 'Email sent',
        });

        const response = await request(app)
            .post('/api/auth/forgot-password')
            .send({
                email: 'janedoe@example.com',
            });

        console.log('Response body:', response.body);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Email sent');
        expect(sendMailMock).toHaveBeenCalled();

        // Check that the user now has a password reset code saved
        const updatedUser = await UserModel.findOne({ email: 'janedoe@example.com' });
        expect(updatedUser.passwordResetCode).toBeDefined();
        expect(updatedUser.passwordResetCode).toHaveLength(6); // Ensure it's a 6-digit code
    });



    it('should return 404 if user does not exist', async() => {
        const response = await request(app)
            .post('/api/auth/forgot-password')
            .send({
                email: 'nonexistent@example.com',
            });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('msg', 'User does not exist');
    });

    it('should return 500 if email sending fails', async() => {
        sendMailMock.mockRejectedValueOnce(new Error('Error sending email'));

        const response = await request(app)
            .post('/api/auth/forgot-password')
            .send({
                email: 'janedoe@example.com',
            });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('message', 'Error: Error sending email');
    });

    it('should return 500 if server error occurs', async() => {
        jest.spyOn(UserModel, 'findOne').mockImplementationOnce(() => {
            throw new Error('Server error');
        });

        const response = await request(app)
            .post('/api/auth/forgot-password')
            .send({
                email: 'janedoe@example.com',
            });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('msg', 'Server error');
    });
});