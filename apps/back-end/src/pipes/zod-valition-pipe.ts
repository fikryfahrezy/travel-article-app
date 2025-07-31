import { PipeTransform } from "@nestjs/common";
import { ValidationError } from "src/exceptions/validation-error";
import z, { type ZodType } from "zod";

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    const parsed = this.schema.safeParse(value);
    if (!parsed.success) {
      throw new ValidationError(
        "Validation failed",
        z.flattenError(parsed.error).fieldErrors,
      );
    }

    return parsed.data;
  }
}
