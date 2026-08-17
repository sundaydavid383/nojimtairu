import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { config } from './config';
import authRoutes from './routes/auth';
import propertyRoutes from './routes/properties';
import paymentRoutes from './routes/payments';
import staffRoutes from './routes/staff';
import activityRoutes from './routes/activities';
import dashboardRoutes from './routes/dashboard';
import emailRoutes from './routes/email';
import imagekitRoutes from './routes/imagekit';
import { errorHandler } from './middleware/errorHandler';
import dns from 'dns';

const app = express();
dns.setServers(["8.8.8.8", "1.1.1.1"]);
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Nojim Tairu & Co. API is running', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/imagekit', imagekitRoutes);

app.use(errorHandler);

const startServer = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log(`Connected to MongoDB at ${config.mongoUri}`);
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
      console.log(`CORS origin: ${config.corsOrigin}`);
    });
  } catch (error: any) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

export default app;
