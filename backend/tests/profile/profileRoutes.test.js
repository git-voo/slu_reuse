import request from 'supertest';
import { app } from '../../server.js';
import mockingoose from 'mockingoose';
import User from '../../models/userModel.js';
import jwt from 'jsonwebtoken';

describe('Auth Routes - Profile', () => {
    let token;
    let userId;
    const mockUser = {
        _id: '60d0fe4f5311236168a109ca',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: 'hashedpassword',
        phone: '1234567890',
        isDonor: true,
        isStudent: false
    };

    beforeAll(() => {
        // Mock the JWT_SECRET environment variable
        process.env.JWT_SECRET = 'testsecret';
    });

    beforeEach(() => {
        // Reset mockingoose before each test to ensure no leakage between tests
        mockingoose.resetAll();

        // Mock the User.findById method to return the mockUser
        mockingoose(User).toReturn(mockUser, 'findOne');

        // Generate JWT token
        const payload = {
            user: {
                id: mockUser._id
            }
        };
        token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        userId = mockUser._id;
    });

    // Test GET /profile
    describe('GET /api/auth/profile', () => {
        it('should return user profile when provided a valid token', async () => {
            const res = await request(app)
                .get('/api/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(res.body).toHaveProperty('email', 'john.doe@example.com');
            expect(res.body).toHaveProperty('first_name', 'John');
            expect(res.body).toHaveProperty('last_name', 'Doe');
        });

        it('should return 401 when no token is provided', async () => {
            const res = await request(app)
                .get('/api/auth/profile')
                .expect(401);

            expect(res.body).toHaveProperty('msg', 'No token, authorization denied');
        });

        it('should return 401 when token is invalid', async () => {
            const res = await request(app)
                .get('/api/auth/profile')
                .set('Authorization', `Bearer invalidtoken`)
                .expect(401);

            expect(res.body).toHaveProperty('msg', 'Token is not valid');
        });
    });

    // Test PUT /profile
    describe('PUT /api/auth/profile', () => {
        it('should update user profile with valid data and token', async () => {
            const updateData = {
                first_name: 'Jane',
                last_name: 'Smith',
                phone: '0987654321'
            };

            // Prepare the updated user data
            const updatedUser = { ...mockUser, ...updateData };

            // Mock the User.findByIdAndUpdate method to return the updated user
            mockingoose(User).toReturn(updatedUser, 'findOneAndUpdate');

            const res = await request(app)
                .put('/api/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .send(updateData)
                .expect(200);

            expect(res.body).toHaveProperty('first_name', 'Jane');
            expect(res.body).toHaveProperty('last_name', 'Smith');
            expect(res.body).toHaveProperty('phone', '0987654321');
        });

        it('should return 400 when updating with invalid data', async () => {
            const invalidData = {
                first_name: '', // Empty first name
                phone: 'invalidphone' // Invalid phone format
            };

            const res = await request(app)
                .put('/api/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .send(invalidData)
                .expect(400);

            expect(res.body).toHaveProperty('errors');
            expect(res.body.errors).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ msg: 'First Name is required' }),
                    expect.objectContaining({ msg: 'A valid phone number is required' })
                ])
            );
        });

        it('should return 401 when no token is provided', async () => {
            const updateData = {
                first_name: 'Jane'
            };

            const res = await request(app)
                .put('/api/auth/profile')
                .send(updateData)
                .expect(401);

            expect(res.body).toHaveProperty('msg', 'No token, authorization denied');
        });

        it('should return 401 when token is invalid', async () => {
            const updateData = {
                first_name: 'Jane'
            };

            const res = await request(app)
                .put('/api/auth/profile')
                .set('Authorization', `Bearer invalidtoken`)
                .send(updateData)
                .expect(401);

            expect(res.body).toHaveProperty('msg', 'Token is not valid');
        });
    });
});
