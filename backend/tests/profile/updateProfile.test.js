import { jest } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app, server } from '../../server.js';
import UserModel from '../../models/userModel.js';

// Mock the UserModel
jest.mock('../../models/userModel.js');

// Mock the JWT verification middleware
jest.mock('jsonwebtoken', () => ({
    ...jest.requireActual('jsonwebtoken'),
    verify: jest.fn(),
}));

const mockUserId = 'mockUserId123';
const mockToken = jwt.sign({ user: { id: mockUserId } }, process.env.JWT_SECRET, { expiresIn: '1h' });

beforeEach(() => {
    jest.clearAllMocks();
});

describe('PUT /api/profile', () => {
    afterAll(async () => {
        if (server && server.close) {
            await server.close();
        }
    });

    const mockUpdatedUser = {
        id: mockUserId,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'johndoe@example.com',
        phone: '0987654321',
        isDonor: false,
        isStudent: true,
        isEmailVerified: true,
    };

    it('should update profile successfully with allowed fields', async () => {
        jwt.verify.mockReturnValue({ user: { id: mockUserId } });
        jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValue(mockUpdatedUser);

        const response = await request(app)
            .put('/api/profile')
            .set('Authorization', `Bearer ${mockToken}`)
            .send({ first_name: 'Jane', last_name: 'Smith', phone: '0987654321', isDonor: false, isStudent: true });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUpdatedUser);
        expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
            mockUserId, { first_name: 'Jane', last_name: 'Smith', phone: '0987654321', isDonor: false, isStudent: true }, { new: true }
        );
    });

    it('should ignore disallowed fields during update', async () => {
        jwt.verify.mockReturnValue({ user: { id: mockUserId } });
        jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValue(mockUpdatedUser);

        const response = await request(app)
            .put('/api/profile')
            .set('Authorization', `Bearer ${mockToken}`)
            .send({ first_name: 'Jane', email: 'newemail@example.com', password: 'newpassword123' });

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUpdatedUser);
        expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
            mockUserId, { first_name: 'Jane' }, { new: true }
        );
    });

    it('should return 404 if user not found', async () => {
        jwt.verify.mockReturnValue({ user: { id: mockUserId } });
        jest.spyOn(UserModel, 'findByIdAndUpdate').mockResolvedValue(null);

        const response = await request(app)
            .put('/api/profile')
            .set('Authorization', `Bearer ${mockToken}`)
            .send({ first_name: 'Jane', last_name: 'Smith' });

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('msg', 'User not found');
    });

    it('should return 500 on server error', async () => {
        jwt.verify.mockReturnValue({ user: { id: mockUserId } });
        jest.spyOn(UserModel, 'findByIdAndUpdate').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const response = await request(app)
            .put('/api/profile')
            .set('Authorization', `Bearer ${mockToken}`)
            .send({ first_name: 'Jane', last_name: 'Smith' });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('msg', 'Server error');
    });
});
