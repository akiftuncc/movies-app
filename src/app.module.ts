import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { CustomerModule } from './modules/customer/customer.module';
import { ManagerModule } from './modules/manager/manager.module';
import { RequestValidationMiddleware } from './middleware/request-validation.middleware';
import { RequestTimingMiddleware } from './middleware/request-timing.middleware';

@Module({
  imports: [UserModule, CustomerModule, ManagerModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestValidationMiddleware, RequestTimingMiddleware)
      .forRoutes('*');
  }
}
