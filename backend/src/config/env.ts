import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Environment variable ${envVar} is required`);
  }
});

export const config = {
  database: {
    url: process.env.DATABASE_URL!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  server: {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
};