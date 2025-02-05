export const CONFIG_ENV = {
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: Number(process.env.JWT_EXPIRATION),
  host: process.env.HOST,
  port: process.env.PORT,
  x_internal_hash: process.env.X_INTERNAL_HASH,
};
