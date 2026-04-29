import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Headers,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import {
  CustomParseInt,
  PositiveNumberPipe,
} from 'src/common/pipes/positive-number.pipe';
import { RarityPipe } from 'src/common/pipes/rarity.pipe';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import {
  type CreateArifactDto,
  CreateArtifactSchema,
} from './artifact.create.dto';

@Controller('/artifacts')
export class ArtifactController {
  // GET /artifacts?skip=0&limit=10&rarity=epic
  @Get()
  getAll(
    @Query('skip', CustomParseInt) skip: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('rarity', RarityPipe) rarity: string,
  ) {
    return { skip, limit, rarity };
  }

  // GET /artifacts/:id
  // пример когда id является UUUID
  //   @Get('/:id')
  //   getById(@Param('id', ParseUUIDPipe) id: string) {
  //     return { id };
  //   }

  // /artifacts/private
  // @Get('/private')
  // @UsePipes(AuthPipe)
  // getPrivateInfo(@Headers() headers: Record<string, string>) {
  //   return { message: `Private info, hurah! ${headers['authorization']}` };
  // }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe, PositiveNumberPipe) id: number) {
    return { id };
  }

  @Post()
  createArtifact(
    @Body(new ZodValidationPipe(CreateArtifactSchema)) body: CreateArifactDto,
  ) {
    return body;
  }
}
