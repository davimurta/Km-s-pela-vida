import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Example protected route that could be used for admin operations
// This is where you would add server-side operations that require
// Firebase Admin SDK or other sensitive operations
app.get('/api/admin/stats', (req, res) => {
  // In a real implementation, you would:
  // 1. Verify the Firebase ID token from the request headers
  // 2. Check if the user has admin permissions
  // 3. Return sensitive data or perform admin operations

  res.json({
    message: 'This endpoint would return admin statistics',
    note: 'Implement Firebase Admin SDK verification here'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
