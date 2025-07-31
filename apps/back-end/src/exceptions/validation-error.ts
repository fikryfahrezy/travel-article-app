import { UnprocessableEntityException } from "@nestjs/common";

export class ValidationError extends UnprocessableEntityException {
  fields: Record<string, unknown>;
  constructor(message: string, fields: Record<string, unknown>) {
    super(message);
    this.name = "ValidationError";
    this.message = message;
    this.fields = fields;
  }
}
