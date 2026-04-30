import { Body, Controller, Post } from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { type CreateCarDto, CreateCarSchema } from './car.create.dto';

@Controller('/cars')
export class CarController {
  @Post()
  createCar(@Body(new ZodValidationPipe(CreateCarSchema)) dto: CreateCarDto) {
    // для примера просто вернем полученные данные назад
    return dto;
  }
}
