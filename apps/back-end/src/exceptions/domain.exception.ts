import { ApiProperty } from "@nestjs/swagger";

export class DomainError extends Error {
  @ApiProperty()
  name: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  errors: string[];
}
