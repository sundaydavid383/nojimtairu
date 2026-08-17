import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ntc_property_records',
  jwtSecret: process.env.JWT_SECRET || 'nojimtairu_super_secret_jwt_key_2024',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development',
  brevo: {
    apiKey: process.env.BREVO_API_KEY || 'YOUR_BREVO_API_KEY',
    senderEmail: process.env.BREVO_SENDER_EMAIL || 'noreply@ntlaw.ng',
    senderName: process.env.BREVO_SENDER_NAME || 'Nojim Tairu & Co.',
  },
  imagekit: {
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'YOUR_IMAGEKIT_PRIVATE_KEY',
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'YOUR_IMAGEKIT_PUBLIC_KEY',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/YOUR_IMAGEKIT_ID',
  },
};

if (config.brevo.apiKey === 'YOUR_BREVO_API_KEY') {
  console.warn('[Config] Brevo API key is not set. Email sending will be disabled until BREVO_API_KEY is provided.');
}

if (config.imagekit.privateKey === 'YOUR_IMAGEKIT_PRIVATE_KEY') {
  console.warn('[Config] ImageKit private key is not set. Signed upload tokens will be disabled until IMAGEKIT_PRIVATE_KEY is provided.');
}

export default config;
