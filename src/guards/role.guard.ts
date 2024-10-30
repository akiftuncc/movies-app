import { getBearerUser } from '@/utils/user-functions';
import { CanActivate, ExecutionContext, Logger, mixin } from '@nestjs/common';
import { IncomingMessage } from 'http';

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
