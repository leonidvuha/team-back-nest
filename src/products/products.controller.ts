import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  Get,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  create(
    @Body() dto: CreateProductDto,
    @Req() req: Request & { user: { id: string } },
  ) {
    const ownerId = req.user.id;
    return this.productsService.create(dto, ownerId);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }
}
