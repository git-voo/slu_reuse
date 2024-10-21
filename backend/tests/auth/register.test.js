import { jest } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import { app, server } from '../../server.js';
import UserModel from '../../models/userModel.js';
import nodemailer from 'nodemailer'; // Import nodemailer to mock it

const sendMailMock = jest.fn();

jest.mock('nodemailer');

// Mock the createTransport method to return an object with the mocked sendMail function
nodemailer.createTransport = jest.fn().mockReturnValue({
    sendMail: sendMailMock,
});

beforeEach(() => {
    jest.clearAllMocks();
    sendMailMock.mockClear();
    nodemailer.createTransport.mockClear();
});

describe('Register API', () => {
    beforeEach(async() => {
        await UserModel.deleteMany({});
        jest.clearAllMocks(); // Clear mocks before each test to avoid interference between tests
    });

    afterAll(async() => {
        await mongoose.connection.close();
        if (server && server.close) {
            await server.close(); // Ensure that the server is closed after tests
        }
    });

    it('should register a new user successfully', async() => {
        sendMailMock.mockImplementationOnce((mailOptions, callback) => {
            callback(null, { status: 200, message: 'Email sent' });
        });
        const response = await request(app)
            .post('/api/auth/register')
            .send({
                first_name: 'Jane',
                last_name: 'Doe',
                email: 'janedoe@example.com',
                password: 'password123',
                phone: '1234567890',
                isDonor: true,
                isStudent: false
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Registration successful');
        expect(sendMailMock).toHaveBeenCalled();
    }, 10000);

    it('should return error if user already exists', async() => {
        await UserModel.create({
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'janedoe@example.com',
            password: 'hashedpassword',
            phone: '1234567890',
            isDonor: true,
            isStudent: false
        });

        const response = await request(app)
            .post('/api/auth/register')
            .send({
                first_name: 'Jane',
                last_name: 'Doe',
                email: 'janedoe@example.com',
                password: 'password123',
                phone: '1234567890',
                isDonor: true,
                isStudent: false
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('msg', 'User already exists');
    });

    it('should return 500 if there is a server error', async() => {
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        jest.spyOn(UserModel.prototype, 'save').mockImplementationOnce(() => {
            throw new Error('Server error');
        });

        const response = await request(app)
            .post('/api/auth/register')
            .send({
                first_name: 'Jane',
                last_name: 'Doe',
                email: 'janedoe@example.com',
                password: 'password123',
                phone: '1234567890',
                isDonor: true,
                isStudent: false
            });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('msg', 'Server error');
        consoleErrorSpy.mockRestore(); // Restore the original console.error after the test
    });
});