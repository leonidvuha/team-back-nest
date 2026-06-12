import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';
import { FarmersModule } from './farmers/farmers.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    ProductsModule,
    UsersModule,
    CategoriesModule,
    FarmersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
