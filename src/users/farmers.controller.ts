import { Controller, Get, Param } from '@nestjs/common';
import { FarmerService } from './farmers.service';

@Controller('farmer')
export class FarmersController {
  constructor(private readonly farmerService: FarmerService) {}

  @Get(':id')
  async getFarmerById(@Param('id') id: string) {
    return this.farmerService.getFarmerById(id);
  }
}
