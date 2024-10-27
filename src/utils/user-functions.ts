import { CONFIG_ENV } from '@/config/config';
import { User, UserType } from '@prisma/client';
import { JwtUser } from 'proto-generated/user_messages';
import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { X_INTERNAL_HASH } from './constants';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Logger, mixin } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { getEnv } from './functions';

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
      expiresIn: 60 * 60 * CONFIG_ENV.jwtExpiresIn,
    })
    .toString();
}

export const getMetadata = (clientJwt: string, jwtSecret: string) => {
  const token = clientJwt.startsWith('Bearer ')
    ? clientJwt.substring(7).trim()
    : clientJwt;
  const headers = {
    authorization: `Bearer ${token}`,
    [X_INTERNAL_HASH]: crypto
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

export const findUserIdByAuthHeader = (authHeader: string) => {
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
  const user = jwt.verify(token, getEnv('JWT_SECRET')) as JwtUser;
  return user;
};

export const AppRoleGuard = (rawRole: string | string[]) => {
  class AppRoleGuardMixin implements CanActivate {
    public readonly logger = new Logger(AppRoleGuardMixin.name);
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const type = context.getType();
      const prefix = 'Bearer ';
      const requiredRoles =
        typeof rawRole === 'string'
          ? rawRole.split('|').map((item) => item.trim())
          : rawRole.map((item) => item.trim());
      let header: string = '';
      if (type === 'http') {
        const request = context.switchToHttp().getRequest<IncomingMessage>();
        header = request.headers.authorization + '';
      }
      if (!header || !header?.startsWith(prefix)) {
        return false;
      }
      const user = getBearerUser(header);
      if (user && user.role) {
        const foundRoles = requiredRoles.filter(
          (role) => role.toLowerCase() === user.role.toLowerCase(),
        );
        if (foundRoles.length > 0) {
          return true;
        }
      }
      return false;
    }
  }
  const guard = mixin(AppRoleGuardMixin);
  return guard;
};

export class AppAuthGuard implements CanActivate {
  private readonly logger = new Logger(AppAuthGuard.name);
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const type = context.getType();
    const prefix = 'Bearer ';

    let header: string = '';
    if (type === 'http') {
      const request = context.switchToHttp().getRequest<IncomingMessage>();
      header = request.headers.authorization + '';
    }
    if (!header || !header?.startsWith(prefix)) {
      return false;
    }
    const user = getBearerUser(header);
    if (user) {
      context.switchToHttp().getRequest().user = user;
    }
    return !!user;
  }
}
