// backend/src/index.ts
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: config.server.clientUrl,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.use('/api', apiRoutes);

// Error handling
app.use(errorHandler);

const PORT = config.server.port || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});