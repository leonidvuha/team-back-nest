import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

// {
//   method: "POST",
//   headers: {
//     "Accept": "Application-JSON",
//     "Content-Type": "Application-JSON",
//     "Authorization": "asdasddsa",
//     "Cookie": ""
//   },
//   url: "http://www.google.com/users/12?important=true",
//   body: {
//     "name": "John"
//   }
// }

// slug

// jwt token - text
// auth:
//  аутентификация - кто ты такой?
//  авторизация - есть ли право на действие?
