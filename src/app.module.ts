import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './article/article.module';
import { AdvertModule } from './advert/advert.module';

@Module({
  imports: [ArticleModule, AdvertModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// tight coupling
// loose coupling

// declarative approach - we just name things - and they exist this way
// imperative approach - we call of functions - they do smth

// monolith
// modular monolith
// microservices
