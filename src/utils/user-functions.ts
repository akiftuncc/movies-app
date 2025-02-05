import { CONFIG_ENV } from '@/config/config';
import { User, UserType } from '@prisma/client';
import { JwtUser } from 'proto-generated/user_messages';
import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const jwtService = new JwtService();

export const userTypeToReadableString = (type: UserType) => {
  switch (type) {
    case UserType.CUSTOMER:
      return 'Customer';
    case UserType.MANAGER:
      return 'Manager';
    default:
      return 'Unknown';
  }
};

export function metadataCreator(token: string) {
  return {
    Authorization: `Bearer ${token}`,
  };
}

export function jwtCreator(payload: JwtUser) {
  return jwt
    .sign(payload, CONFIG_ENV.jwtSecret + '', {
      expiresIn: 60 * 60 * CONFIG_ENV.jwtExpiration,
    })
    .toString();
}

export const getMetadata = (clientJwt: string, jwtSecret: string) => {
  const token = clientJwt.startsWith('Bearer ')
    ? clientJwt.substring(7).trim()
    : clientJwt;
  const headers = {
    authorization: `Bearer ${token}`,
    [CONFIG_ENV.x_internal_hash]: crypto
      .createHash('md5')
      .update(jwtSecret)
      .digest('hex')
      .toLowerCase(),
  };
  return headers;
};

export const isPasswordEqual = (pwd: string, hash: string) => {
  return bcrypt.compareSync(pwd, hash);
};

export const payloadCreator = (user: User): JwtUser => {
  const payload: JwtUser = {
    username: user.username,
    sub: user.id.toString(),
    role: userTypeToReadableString(user.type),
    iss: 'auth',
  };
  return payload;
};

export const findUserIdByAuthHeader = (
  authHeader: string,
  jwtService: JwtService,
) => {
  const token = authHeader.split(' ')[1];
  const decoded = jwtService.verify(token, { secret: CONFIG_ENV.jwtSecret });
  const userId = decoded.sub;
  return userId;
};

export const getBearerUser = (header: string): JwtUser | null => {
  const prefix = 'Bearer ';
  if (!header || !header?.startsWith(prefix)) {
    return null;
  }
  const token = header.slice(header.indexOf(' ') + 1);
  const user = jwt.verify(token, CONFIG_ENV.jwtSecret) as JwtUser;
  return user;
};
