import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert `import.meta.url` to a path and get the directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your Google credentials file
const KEY_PATH = path.join(__dirname, '../config/google_credentials.json');

// Define variables to be exported
let drive;
let auth;

try {
  // Read and parse the credentials file
  const rawCredentials = fs.readFileSync(KEY_PATH, 'utf-8');
  console.log('Credentials file content:', rawCredentials); // Debug log
  const credentials = JSON.parse(rawCredentials);

  auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  drive = google.drive({ version: 'v3', auth });
} catch (error) {
  console.error('Failed to load Google credentials:', error);
  throw error; // Re-throw to prevent app from running with missing credentials
}

// Export the variables
export { drive, auth };
