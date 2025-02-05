import { Module, NestModule } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { CustomerModule } from './modules/customer/customer.module';
import { ManagerModule } from './modules/manager/manager.module';

@Module({
  providers: [],
  imports: [UserModule, CustomerModule, ManagerModule],
})
export class AppModule implements NestModule {
  configure() {}
}
