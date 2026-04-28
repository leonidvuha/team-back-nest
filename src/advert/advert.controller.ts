import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Headers,
  Req,
} from '@nestjs/common';
import { AdvertService } from './advert.service';
import { PositiveNumberPipe } from 'src/common/pipes/positive-number.pipe';

@Controller('/adverts')
export class AdvertController {
  constructor(private readonly advertService: AdvertService) {}

  @Get()
  findAll() {
    return this.advertService.findAll();
  }

  // /adverts/example?skip=2&limit=10
  @Get('/example')
  example(
    @Query('skip', ParseIntPipe) skip: number,
    @Query('limit') limit: string,
  ) {
    console.log(skip);
    console.log(limit);
    return { skip, limit };
  }

  // /adverts/get-headers - если хотим работать со всеми хедерами
  @Get('/get-headers')
  getHeaders(@Headers() headers: Record<string, string>) {
    // вернет все хедеры
    return headers;
  }

  @Get('/get-auth-header')
  getAuthHeaders(@Headers('authorization') token: string) {
    // достали хедер authorization
    return { token };
  }

  @Get('/example-2')
  getRequestInfo(@Req() req: Request) {
    // console.log(req);
    // достали метод для примера
    return { method: req.method };
  }

  @Get('/:id')
  findOne(@Param('id', ParseIntPipe, PositiveNumberPipe) id: number) {
    console.log(id);
    return { id };
  }
}

// headers, url, body, method

// headers
// {
//   "content-type": "json"
// }

// body
// {
//   "email": "sdasd",
//   "password": "sdaasdsd"
// }

// url
// http://google.com/search?q=blablabla
// http://google.com/users/2?new=true
// /users/2 - path
// 2 - path variable
// new - query param

// Record

// const obj: Record<string, number> = {
//   age: 28,
//   height: 190,
//   height2: 190,
//   height3: 190,
//   height4: 190,
// };
