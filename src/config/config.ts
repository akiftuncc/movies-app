import { getEnv } from '@/utils/functions';

export const CONFIG_ENV = {
  databaseUrl: getEnv('DATABASE_URL'),
  appMode: getEnv('APP_MODE'),
  jwtSecret: getEnv('JWT_SECRET'),
  jwtExpiresIn: Number(getEnv('JWT_EXPIRES_IN')),
  host: getEnv('HOST'),
  port: getEnv('PORT'),
  redisHost: getEnv('REDIS_HOST'),
  redisPort: getEnv('REDIS_PORT'),
  redisDb: getEnv('REDIS_DB'),
  redisUsername: getEnv('REDIS_USERNAME'),
  redisPassword: getEnv('REDIS_PASSWORD'),
};
