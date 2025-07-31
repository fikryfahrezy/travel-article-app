import z from "zod";

const EnvironmentVariables = z.object({
  DATABASE_HOST: z.string(),
  DATABASE_PORT: z.string().transform((val) => Number(val)),
  DATABASE_USERNAME: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_DBNAME: z.string(),
  JWT_SECRET: z.string(),
  JWT_ISSUER: z.string(),
  TOKEN_COOKIE_DOMAIN: z.string(),
});

export type EnvironmentVariables = {
  env: z.infer<typeof EnvironmentVariables>;
};

export function validateEnv(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const result = EnvironmentVariables.safeParse(config);

  if (!result.success) {
    throw new Error(result.error.message);
  }

  return { env: result.data };
}
