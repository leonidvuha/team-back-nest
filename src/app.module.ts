import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AdvertModule } from './advert/advert.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, AdvertModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
