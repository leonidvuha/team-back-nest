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
  Patch,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetProductsDto } from './dto/get-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { UpdateStatusDto } from './dto/update-status.dto';

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
  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  async getMy(@CurrentUser() user: { id: string }) {
    return this.productsService.findMy(user.id);
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.productsService.findById(id, user.id);
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

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateStatusDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.productsService.updateStatus(id, dto, user.id);
  }
}
