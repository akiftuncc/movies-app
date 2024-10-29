import { Module } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { CustomerModule } from './modules/customer/customer.module';

@Module({
  imports: [UserModule, CustomerModule],
})
export class AppModule {}
