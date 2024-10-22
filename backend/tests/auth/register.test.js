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

describe('Register API', () => {
    afterAll(async() => {
        if (server && server.close) {
            await server.close();
        }
    });

    it('should register a new user successfully', async() => {
        // Spy on the findOne method to return null (user does not exist)
        jest.spyOn(UserModel, 'findOne').mockResolvedValue(null);

        // Mock save method on UserModel instances to simulate a successful save
        UserModel.prototype.save = jest.fn().mockResolvedValue({
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'janedoe@example.com',
            phone: '1234567890',
            isDonor: true,
            isStudent: false
        });

        // Mock sendMail to simulate a successful email send
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
    });

    it('should return error if user already exists', async() => {
        // Spy on the findOne method to return an existing user (simulating a user already present)
        jest.spyOn(UserModel, 'findOne').mockResolvedValue({
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

        // Mock findOne to return null, simulating that no user exists
        jest.spyOn(UserModel, 'findOne').mockResolvedValue(null);

        // Mock the save method to throw an error (simulating a server error)
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

        console.log('Response status:', response.status); // Log the status code for debugging
        console.log('Response body:', response.body);
        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('msg', 'Server error');
        consoleErrorSpy.mockRestore();
    });
});