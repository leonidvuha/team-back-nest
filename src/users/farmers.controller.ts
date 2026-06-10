import { Controller, Get, Param } from '@nestjs/common';
import { FarmerService } from './farmers.service';

@Controller('farmer')
export class FarmersController {
  constructor(private readonly farmerService: FarmerService) {}

  @Get('active/sellers')
  async getActiveSellers() {
    return this.farmerService.getActiveSellers();
  }

  @Get(':id')
  async getFarmerById(@Param('id') id: string) {
    return this.farmerService.getFarmerById(id);
  }
}
