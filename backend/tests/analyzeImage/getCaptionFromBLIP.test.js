import { jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import axios from 'axios'; // Import Axios to mock
import router from '../../routes/analyzeImageRoutes.js'; // Import only the router

// Mock Axios
jest.mock('axios');

const app = express();
app.use(express.json());
app.use('/', router);

beforeEach(() => {
    jest.clearAllMocks(); // Clear any mocks before each test
});

describe('Image Captioning API', () => {
    it('should return a caption when a valid image URL is provided', async() => {
        // Mock axios.post directly to return a successful response
        axios.post = jest.fn().mockResolvedValue({
            data: { caption: 'A sample caption from the BLIP model' },
        });

        const response = await request(app)
            .post('/')
            .send({ imageUrl: 'http://example.com/sample.jpg' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('description', 'A sample caption from the BLIP model');
        expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:4301/caption', { imageUrl: 'http://example.com/sample.jpg' });
    });

    it('should return 400 if imageUrl is missing', async() => {
        const response = await request(app).post('/').send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error', 'Image URL is required');
    });

    it('should return 500 if the captioning service fails', async() => {
        // Mock axios.post directly to simulate a failure
        axios.post = jest.fn().mockRejectedValue(new Error('Failed to get caption'));

        const response = await request(app)
            .post('/')
            .send({ imageUrl: 'http://example.com/sample.jpg' });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty('error', 'Error analyzing image');
        expect(axios.post).toHaveBeenCalledWith('http://127.0.0.1:4301/caption', { imageUrl: 'http://example.com/sample.jpg' });
    });
<<<<<<< HEAD

=======
>>>>>>> eb9a2d3d5c0625bcff54ec8dbece882d940c9352
});