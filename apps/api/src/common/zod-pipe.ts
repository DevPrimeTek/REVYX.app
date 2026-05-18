import { BadRequestException, Injectable, type PipeTransform } from '@nestjs/common';
import type { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown) {
    const parsed = this.schema.safeParse(value);
    if (!parsed.success) {
      throw new BadRequestException({
        code: 'VALIDATION_FAILED',
        issues: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })),
      });
    }
    return parsed.data;
  }
}

// Sugar: @Body(ZodBody(schema)) instead of @Body(new ZodValidationPipe(schema))
export function ZodBody(schema: ZodSchema): ZodValidationPipe {
  return new ZodValidationPipe(schema);
}
