import { BadRequestException, PipeTransform } from '@nestjs/common';
import z from 'zod';
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.ZodSchema) {}
  transform(value: unknown) {
    const result = this.schema.safeParse(value);
    if (!result.success) {
      console.log(
        result.error.issues.map((issue) => ({
          message: issue.message,
          field: issue.path.at(0),
        })),
      );
      throw new BadRequestException(z.treeifyError(result.error));
    }
    return result.data;
  }
}
