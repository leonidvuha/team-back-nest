import { Controller, Get, Param, Query } from '@nestjs/common';
import { FarmerService } from './farmers.service';

@Controller('farmers')
export class FarmersController {
  constructor(private readonly farmerService: FarmerService) {}

  @Get()
  async getAllFarmers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.farmerService.getAllFarmers(
      page ? Number(page) : 1,
      limit ? Number(limit) : 9,
    );
  }

  @Get(':id')
  async getFarmerById(@Param('id') id: string) {
    return this.farmerService.getFarmerById(id);
  }
}
