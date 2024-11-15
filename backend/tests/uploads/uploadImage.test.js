// Import necessary modules
import request from 'supertest';
import { app } from '../../server.js'; // Adjust path to where `app` is exported in server.js

import { drive } from '../../utils/googleDriveConfig.js'; // Import Google Drive config to mock API calls

// Mock Google Drive API to avoid real uploads during testing
jest.mock('../../utils/googleDriveConfig.js', () => ({
  drive: {
    files: {
      create: jest.fn(),
    },
  },
}));

describe('Google Drive Image Upload Tests', () => {
  
  // Helper function to generate a minimal PNG image buffer
  const generateImageBuffer = () => {
    // This represents the binary content of a tiny PNG file header
    return Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG file signature
      0x00, 0x00, 0x00, 0x0D,                         // IHDR chunk length
      0x49, 0x48, 0x44, 0x52,                         // IHDR chunk type
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, // 1x1 pixel size
      0x08, 0x06, 0x00, 0x00, 0x00,                   // 8-bit, RGBA
      0x1F, 0x15, 0xC4, 0x89,                         // CRC
      0x00, 0x00, 0x00, 0x0A,                         // IDAT chunk length
      0x49, 0x44, 0x41, 0x54,                         // IDAT chunk type
      0x78, 0x9C, 0x63, 0x00, 0x00, 0x00, 0x02, 0x00, // Compressed data
      0x01, 0xE5, 0x27, 0xD8, 0x63,                   // CRC
      0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, // IEND chunk
      0xAE, 0x42, 0x60, 0x82                          // CRC
    ]);
  };

  // Test case for successful image upload
  it('should successfully upload an image and return a Google Drive URL', async () => {
    // Mock response from Google Drive API for a successful upload
    drive.files.create.mockResolvedValue({
      data: {
        id: 'sample-file-id',
        webViewLink: 'https://drive.google.com/file/d/sample-file-id/view',
      },
    });

    // Generate a small image buffer to simulate file upload
    const imageBuffer = generateImageBuffer();

    // Send POST request to upload endpoint with generated image buffer
    const response = await request(app)
      .post('/api/images/upload')
      .attach('image', imageBuffer, 'test-image.png'); // Use a fake filename "test-image.png"

    // Assert that the response status is 200 and URL format is correct
    expect(response.status).toBe(200);
    expect(response.body.url).toContain('https://drive.google.com/');
  });

  // Test case for failed upload due to missing image
  it('should return 500 if no image is provided', async () => {
    const response = await request(app).post('/api/images/upload');
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to upload image');
  });

  // Test case for Google Drive error
  it('should handle Google Drive API errors gracefully', async () => {
    // Mock Google Drive API to simulate an error
    drive.files.create.mockRejectedValue(new Error('Google Drive API error'));

    const imageBuffer = generateImageBuffer();
    const response = await request(app)
      .post('/api/images/upload')
      .attach('image', imageBuffer, 'test-image.png');

    // Expect a 500 status and an error message
    expect(response.status).toBe(500);
    expect(response.body.error).toContain('Google Drive API error');
  });
});
