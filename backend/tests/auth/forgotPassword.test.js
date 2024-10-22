import { jest } from '@jest/globals';
import request from 'supertest';
import { app, server } from '../../server.js';
import UserModel from '../../models/userModel.js';
import nodemailer from 'nodemailer';

const sendMailMock = jest.fn();

jest.mock('nodemailer');
jest.mock('../../models/userModel.js'); // Mock the UserModel

// Mock the createTransport method to return an object with the mocked sendMail function
nodemailer.createTransport = jest.fn().mockReturnValue({
    sendMail: sendMailMock,
});

beforeEach(() => {
    jest.clearAllMocks();
    sendMailMock.mockClear();
    nodemailer.createTransport.mockClear();
});

describe('Forgot Password API', () => {
    afterAll(async() => {
        if (server && server.close) {
            await server.close();
        }
    });

    it('should send reset password email successfully', async() => {
        // Mock findOne to return an existing user
        jest.spyOn(UserModel, 'findOne').mockResolvedValue({
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'janedoe@example.com',
            password: 'hashedpassword',
            isDonor: true,
            isStudent: false,
            save: jest.fn().mockResolvedValue(), // Mock the save method on the user instance
        });

        // Mock sendMail to simulate a successful email send
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

        // Verify that the save method was called (indicating that a reset code was saved)
        const mockUser = await UserModel.findOne();
        expect(mockUser.save).toHaveBeenCalled();
    });

    it('should return 404 if user does not exist', async() => {
        // Mock findOne to return null, simulating that the user doesn't exist
        jest.spyOn(UserModel, 'findOne').mockResolvedValue(null);

        const response = await request(app)
            .post('/api/auth/forgot-password')
            .send({
                email: 'nonexistent@example.com',
            });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('msg', 'User does not exist');
    });

    it('should return 500 if email sending fails', async() => {
        // Mock findOne to return an existing user
        jest.spyOn(UserModel, 'findOne').mockResolvedValue({
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'janedoe@example.com',
            password: 'hashedpassword',
            isDonor: true,
            isStudent: false,
            save: jest.fn().mockResolvedValue(), // Mock the save method on the user instance
        });

        // Mock sendMail to simulate an email sending failure
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
        // Mock findOne to throw an error, simulating a server error during the user lookup
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