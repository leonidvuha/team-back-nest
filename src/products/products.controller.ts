import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  Get,
  Query,
  Put,
  Param,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetProductsDto } from './dto/get-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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
  findAll(@Query() query: GetProductsDto) {
    return this.productsService.findAll(query);
  }
  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @Req() req: Request & { user: { id: string } },
  ) {
    const ownerId = req.user.id;
    return this.productsService.update(id, dto, ownerId);
  }
}
