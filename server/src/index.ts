import dotenv from 'dotenv';
import { app, ensureDatabaseConnection } from './app';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await ensureDatabaseConnection();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 API Documentation: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();