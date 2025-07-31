import { DatabaseError } from "pg";
import { QueryFailedError } from "typeorm";

export function isPgError(error: unknown): error is DatabaseError {
  return (
    !!error && typeof error === "object" && "code" in error && "detail" in error
  );
}

export function isUniqueConstraintViolationError(
  error: unknown,
  constraintName?: string,
): error is QueryFailedError<DatabaseError> {
  if (!(error instanceof QueryFailedError)) {
    return false;
  }

  if (!isPgError(error.driverError)) {
    return false;
  }

  if (error.driverError.code !== "23505") {
    return false;
  }

  if (!constraintName || error.driverError.constraint === constraintName) {
    return true;
  }

  // Fallback if the error constraint not not in the `constraint` field, but in the detail instead
  return (
    error.driverError.detail !== undefined &&
    error.driverError.detail.includes(constraintName)
  );
}
