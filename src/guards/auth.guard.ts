import { getBearerUser } from '@/utils/user-functions';
import { CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { IncomingMessage } from 'http';

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
