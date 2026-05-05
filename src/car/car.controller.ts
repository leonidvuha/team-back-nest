import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { type CreateCarDto, CreateCarSchema } from './car.create.dto';
import { CarService } from './car.service';

@Controller('/cars')
export class CarController {
  constructor(private readonly service: CarService) {}
  @Get()
  getAllCars() {
    return this.service.findAll();
  }

  // /cars/12

  @Get('/:id')
  getCarById(@Param('id', ParseIntPipe) id: number) {
    return this.service.findById(id);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.service.delete(id);
  }

  @Post()
  createCar(@Body(new ZodValidationPipe(CreateCarSchema)) dto: CreateCarDto) {
    return this.service.create(dto);
  }
}
