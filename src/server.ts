import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';

const startServer = async () => {
  try {
    await connectDB();

    const PORT = parseInt(env.PORT, 10);

    // app.listen(PORT, () => {
    //   console.log(`🚀 Server running on port ${PORT} in ${env.NODE_ENV} mode`);
    // });
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
