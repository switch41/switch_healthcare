import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8081',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  encryptionKey: process.env.ENCRYPTION_KEY || 'change-this-in-production',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  medAlpacaEndpoint: process.env.MEDALPACA_ENDPOINT || 'https://api-inference.huggingface.co/models/medalpaca/medalpaca-7b',
  huggingfaceApiKey: process.env.HUGGINGFACE_API_KEY || '',
  supabase: {
    url: process.env.SUPABASE_URL || 'https://nxpbenrachmbgbcjnuhb.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || 'sb_publishable_BWjcitmVYxjaOJjNptctvw_YetXdWen',
  },
  emailService: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
  },
  hipaa: {
    auditLogLevel: process.env.AUDIT_LOG_LEVEL || 'info',
    encryptionAtRest: process.env.ENCRYPTION_AT_REST === 'true',
    accessLogRetention: parseInt(process.env.ACCESS_LOG_RETENTION || '2555', 10), // 7 years in days
  }
};
