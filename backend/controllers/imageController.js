import { drive } from '../utils/googleDriveConfig.js';  

// Function to convert buffer to a readable stream
const bufferToStream = (buffer) => {
  const readableStream = new Readable();
  readableStream.push(buffer);
  readableStream.push(null);
  return readableStream;
};



export const uploadImage = async (req, res) => {
  try {
    // Set metadata for the file in Google Drive
    const fileMetadata = {
      name: req.file.originalname,  // File name to be saved in Google Drive
      parents: ['1p1w12_CRC1stpsQaw9eMX-KDSz1e93se'],  // Google Drive folder ID
    };

    // Prepare the media content using the buffer from the uploaded file
    const media = {
      mimeType: req.file.mimetype,
      body: bufferToStream(req.file.buffer),  // Convert buffer to a stream
    };

    // Upload the file to Google Drive
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',  // Fields to return in the response
    });

    // Send back the URL of the uploaded file in Google Drive
    res.status(200).json({ url: response.data.webViewLink });
  } catch (error) {
    console.error('Error uploading image to Google Drive:', error);
    res.status(500).json({ message: 'Image upload failed', error });
  }
};

