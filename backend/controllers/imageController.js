import { drive } from '../utils/googleDriveConfig.js';
import { Readable } from 'stream';

// Function to convert buffer to a readable stream
const bufferToStream = (buffer) => {
  const readableStream = new Readable();
  readableStream.push(buffer);
  readableStream.push(null);
  return readableStream;
};

// Function to add a small delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const uploadImage = async (req, res) => {
  try {
    // Set metadata for the file in Google Drive
    const fileMetadata = {
      name: req.file.originalname,
      parents: ['Your Google Drive Folder ID'], // Replace with your actual folder ID
    };

    // Prepare the media content using the buffer from the uploaded file
    const media = {
      mimeType: req.file.mimetype,
      body: bufferToStream(req.file.buffer),
    };

    // Step 1: Upload the file to Google Drive
    const uploadResponse = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id', // Request only the id field
    });

    const fileId = uploadResponse.data.id;

    // Step 2: Add a delay to ensure Google Drive processes the upload
    await delay(2000); // Delay for 2 seconds

    // Step 3: Set the file permissions to make it publicly accessible
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Step 4: Verify if permissions are correctly set
    const permissions = await drive.permissions.list({
      fileId: fileId,
      fields: 'permissions',
    });
    console.log("Current permissions:", permissions.data.permissions);

    // Step 5: Double-check the file metadata to ensure it's publicly accessible
    const fileMetadataCheck = await drive.files.get({
      fileId: fileId,
      fields: 'id, webContentLink, webViewLink',
    });
    console.log("File metadata:", fileMetadataCheck.data);

    // Step 6: Construct the URL in the required format manually
    const viewURL = `https://drive.google.com/uc?export=view&id=${fileId}`;

    // Send back the view URL in the response
    res.status(200).json({ url: viewURL });
  } catch (error) {
    console.error('Error uploading image to Google Drive:', error);
    res.status(500).json({ message: 'Image upload failed', error });
  }
};
